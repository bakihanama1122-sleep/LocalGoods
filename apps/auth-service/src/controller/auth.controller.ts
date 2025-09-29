import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp, validateRegistrationData } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma/index";
import { AuthenticationError, ValidationError } from "../../../../packages/error-handler/index";
import { checkOtpRestrictions, trackOtpRequests,verifyOtp,handleForgotPassword,verifyForgotPasswordOtp } from "../utils/auth.helper";
import { setCookie } from "../utils/cookies/setCookies";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: {email} });

    if (existingUser) {
      return next(new ValidationError(`User already exists with this mail`));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name,email, "user-activation-mail");
    res.status(200).json({
      message: "OTP send to email.please verify your account.",
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyUser = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {email,otp,password,name} = req.body;
    if(!email || !otp || !password || !name){
      return next(new ValidationError("All fields are required."));
    }

    const existingUser = await prisma.users.findUnique({where:{email}})

    if(existingUser){
      return next(new ValidationError("User already exists."));
    }
    await verifyOtp(email,otp,next);

    const hashedPassword = await bcrypt.hash(password,10);
    await prisma.users.create({
      data:{name,email,password:hashedPassword}
    });

    res.status(201).json({
      success:true,
      message:"User registered succesfully!",
    })
  } catch (error) {
    return next(error);
  }
}

export const loginUser = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return next(new ValidationError("Email and password are required!"));
    }
    const user = await prisma.users.findUnique({where:{email}});
    if(!user) return next(new AuthenticationError("User doesn' exists!"));
    const isMatch = await bcrypt.compare(password,user.password!);
    if(!isMatch){
      return next(new AuthenticationError("Invalid email or password."));
    }
    const accessToken = jwt.sign({id:user.id,role:"user"},
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn:"15m"
      }
    )
    const refreshToken = jwt.sign({id:user.id,role:"user"},
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn:"7d"
      }
    )
    setCookie(res,"refresh_token",refreshToken);
    setCookie(res,"access_token",accessToken);
    res.status(200).json({
      message:"Login successful",
      user:{id:user.id,email:user.email,name:user.name}
    })
  } catch (error) {
    
  }
}

export const userForgotPassword = async(req:Request,res:Response,next:NextFunction)=>{
  await handleForgotPassword(req,res,next,'user');
};

export const verifyUserForgotPassword = async(req:Request,res:Response,next:NextFunction)=>{
  await verifyForgotPasswordOtp(req,res,next);
}

export const resetUserPassword = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const body = req.body as Record<string, any>;
    const {email,newPasword} = body;
    if(!email || !newPasword){
      return next(new ValidationError("Email and new password are required!"));
    }
    const user = await prisma.users.findUnique({where:{email}});
    if(!user) return next(new ValidationError("User not found!"));
    const isSamePassword = await bcrypt.compare(newPasword,user.password as string);
    if(isSamePassword){
      return next(new ValidationError("New password cannot be same as old password."));
    }
    const hashedPassword = await bcrypt.hash(newPasword,10);
    await prisma.users.update({
      where:{email},
      data:{password:hashedPassword},
    });
    res.status(200).json({message:"Password reset successfully!"});
  } catch (error) {
    next(error);
  }
}