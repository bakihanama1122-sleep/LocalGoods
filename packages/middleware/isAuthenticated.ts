import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma/index";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log("🔐 isAuthenticated middleware called");
    console.log("🍪 All cookies:", req.cookies);
    
    const token =
      req.cookies["access_token"] ||
      req.cookies["seller-access-token"] ||
      req.cookies["admin-access-token"] ||
      req.headers.authorization?.split(" ")[1];
    
    console.log("🎫 Token found:", token ? "YES" : "NO");
    console.log("🎫 Token value:", token ? token.substring(0, 20) + "..." : "NONE");
    
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "Unauthorized! Token missing." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller" | "admin";
    };
    
    console.log("✅ Token decoded successfully:", { id: decoded.id, role: decoded.role });
    
    if (!decoded) {
      console.log("❌ Token decoded but is null/undefined");
      return res.status(401).json({
        message: "Unauthorized! Invalid token.",
      });
    }

    let account;
    if (decoded.role === "user" || decoded.role === "admin") {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
      req.user = account;
    }else if(decoded.role === "seller"){
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include:{Shop:true}
      });
      req.seller = account;
    }

    if (!account) {
      return res.status(401).json({ message: "Account not found!" });
    }

    req.role = decoded.role;

    return next();
  } catch (error) {
    console.log("❌ JWT verification failed:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized! Token expired or invalid." });
  }
};

export default isAuthenticated;

