import { Response, NextFunction } from "express";
import prisma from "../../../../packages/libs/prisma";

// Get shop details by shop ID (for public shop profile)
export const getShop = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // This is shop ID

    console.log(`Getting shop details for shop ID: ${id}`);

    const shop = await prisma.shops.findUnique({
      where: { id },
      include: {
        avatar: true,
        images: true,
        followers: true,
        reviews: {
          include: {
            user: true
          }
        },
        products: {
          where: { isDeleted: false },
          include: {
            images: true
          },
          take: 5 // Limit to recent products
        }
      }
    });

    // Then get the seller separately if it exists
    let seller = null;
    if (shop?.sellerId) {
      try {
        seller = await prisma.sellers.findUnique({
          where: { id: shop.sellerId }
        });
      } catch (error) {
        console.log(`Seller with ID ${shop.sellerId} not found`);
      }
    }

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    const followersCount = shop?.followers?.length || 0;

    res.status(200).json({
      success: true,
      shop: {
        ...shop,
        coverBanner: shop.coverBanner || "/store_banner_fallback.jpg",
        avatar: shop.avatar || "/store_fallback.png"
      },
      seller: seller, // Include seller details (or null if not found)
      followersCount
    });
  } catch (error: any) {
    console.error('Error in getShop:', error);
    
    // If it's a database connection error, return a helpful message
    if (error.code === 'P1001') {
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please check your database configuration."
      });
    }
    
    next(error);
  }
};

// Get seller details by seller ID (for admin/seller management)
export const getSeller = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    console.log(`Getting seller details for ID: ${id}`);

    const seller = await prisma.sellers.findUnique({
      where: { id },
      include: {
        Shop: {
          include: {
            avatar: true,
            images: true,
            followers: true,
            reviews: {
              include: {
                user: true
              }
            },
            products: {
              where: { isDeleted: false },
              include: {
                images: true
              },
              take: 5 // Limit to recent products
            }
          }
        }
      }
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    if (!seller.Shop) {
      return res.status(404).json({
        success: false,
        message: "Seller shop not found"
      });
    }

    const followersCount = seller.Shop?.followers?.length || 0;

    res.status(200).json({
      success: true,
      shop: {
        ...seller.Shop,
        coverBanner: seller.Shop.coverBanner || "/store_banner_fallback.jpg",
        avatar: seller.Shop.avatar || "/store_fallback.png"
      },
      seller: seller, // Include seller details
      followersCount
    });
  } catch (error:any) {
    console.error('Error in getSeller:', error);
    
    // If it's a database connection error, return a helpful message
    if (error.code === 'P1001') {
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please check your database configuration."
      });
    }
    
    next(error);
  }
};

// Get seller dashboard stats
export const getSellerStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log('getSellerStats called');
    console.log('req.seller:', req.seller);
    console.log('req.role:', req.role);
    console.log('req.cookies:', req.cookies);
    
    const seller = req.seller;

    if (!seller) {
      console.log('No seller found in request');
      return res.status(401).json({
        success: false,
        message: "Seller authentication required"
      });
    }

    console.log('Seller found:', seller.id);
    console.log('Seller Shop ID:', seller.Shop?.id);

    // Get additional shop data for stats
    const shopWithStats = await prisma.shops.findUnique({
      where: { id: seller.Shop.id },
      include: {
        products: {
          where: { isDeleted: false }
        },
        followers: true,
        orders: true
      }
    });

    if (!shopWithStats) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    // Calculate stats
    const totalProducts = shopWithStats.products.length;
    const totalFollowers = shopWithStats.followers.length;
    const totalOrders = shopWithStats.orders.length;
    
    // Calculate total revenue (simplified - using order total if available)
    const totalRevenue = shopWithStats.orders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    res.status(200).json({
      success: true,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalFollowers
    });
  } catch (error: any) {
    console.error('Error in getSellerStats:', error);
    next(error);
  }
};

// Get seller products
export const getSellerProducts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    console.log(`Getting products for seller ID: ${id}, page: ${page}, limit: ${limit}`);

    // First get the shop ID from seller
    const seller = await prisma.sellers.findUnique({
      where: { id },
      select: { Shop: { select: { id: true } } }
    });

    if (!seller?.Shop) {
      return res.status(404).json({
        success: false,
        message: "Seller shop not found"
      });
    }

    const products = await prisma.products.findMany({
      where: {
        shopId: seller.Shop.id,
        isDeleted: false
      },
      include: {
        images: true,
        Shop: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      skip,
      take: parsedLimit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.products.count({
      where: {
        shopId: seller.Shop.id,
        isDeleted: false
      }
    });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error('Error in getSellerProducts:', error);
    next(error);
  }
};

// Check if user is following a shop
export const isFollowing = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // shop ID
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    console.log(`Checking follow status for shop ID: ${id}, user ID: ${userId}`);

    const follow = await prisma.follower.findUnique({
      where: {
        userId_shopsId: {
          userId,
          shopsId: id
        }
      }
    });

    res.status(200).json({
      success: true,
      isFollowing: !!follow,
      followId: follow?.id || null
    });
  } catch (error) {
    console.error('Error in isFollowing:', error);
    next(error);
  }
};

// Get seller events (products with ending_date)
export const getSellerEvents = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // seller ID
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    console.log(`Getting events for seller ID: ${id}, page: ${page}, limit: ${limit}`);

    // First get the shop ID from seller
    const seller = await prisma.sellers.findUnique({
      where: { id },
      select: { Shop: { select: { id: true } } }
    });

    if (!seller?.Shop) {
      return res.status(404).json({
        success: false,
        message: "Seller shop not found"
      });
    }

    const products = await prisma.products.findMany({
      where: {
        shopId: seller.Shop.id,
        isDeleted: false,
        ending_date: {
          not: null
        }
      },
      include: {
        images: true,
        Shop: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      skip,
      take: parsedLimit,
      orderBy: {
        ending_date: 'asc'
      }
    });

    const total = await prisma.products.count({
      where: {
        shopId: seller.Shop.id,
        isDeleted: false,
        ending_date: {
          not: null
        }
      }
    });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error('Error in getSellerEvents:', error);
    next(error);
  }
};

// Toggle follow/unfollow shop
export const toggleFollow = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // shop ID
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    console.log(`Toggling follow for shop ID: ${id}, user ID: ${userId}`);

    // Check if already following
    const existingFollow = await prisma.follower.findUnique({
      where: {
        userId_shopsId: {
          userId,
          shopsId: id
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follower.delete({
        where: { id: existingFollow.id }
      });

      res.status(200).json({
        success: true,
        action: "unfollowed",
        message: "Successfully unfollowed the shop"
      });
    } else {
      // Follow
      await prisma.follower.create({
        data: {
          userId,
          shopsId: id
        }
      });

      res.status(200).json({
        success: true,
        action: "followed",
        message: "Successfully followed the shop"
      });
    }
  } catch (error) {
    console.error('Error in toggleFollow:', error);
    next(error);
  }
};