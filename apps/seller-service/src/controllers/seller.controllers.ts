import { Response,NextFunction } from "express";

export const sellerNotifications = async(
    req:any,
    res:Response,
    next:NextFunction
)=>{
    try {
        const sellerId = req.seller.id;

        const notifications = await prisma.notifications.findMany({
            where:{
                receiverId:sellerId,
            },
            orderBy:{
                createdAt:"desc"
            },
        });

        res.status(200).json({
            succes:true,
            notifications
        })
    } catch (error) {
        next(error);
    }
}

