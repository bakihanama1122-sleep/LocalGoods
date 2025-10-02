import { AuthenticationError } from "@error-handler/index";
import {Response, NextFunction } from "express";

export const isSeller = (req:any,res:Response,next:NextFunction)=>{
    if(req.role !== "seller"){
        return next(new AuthenticationError("Access denied: Sellers only"));
    }
    next();
}

export const isUser = (req:any,res:Response,next:NextFunction)=>{
    if(req.role !== "user"){
        return next(new AuthenticationError("Access denied: Users only"));
    }
    next();
}