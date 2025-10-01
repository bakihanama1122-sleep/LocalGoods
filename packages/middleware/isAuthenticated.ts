import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isAuthorized = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized! Token missing."});
        }
        
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as {
            id:string;
            role: "user" | "seller";
        }
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized! Invalid token.",
            });
        }
        await prisma.users.findUnique({where:{id:decoded.id}})
    } catch (error) {
        
    }
}