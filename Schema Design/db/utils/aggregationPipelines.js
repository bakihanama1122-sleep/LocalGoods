const mongoose = require('mongoose');

// Product aggregation pipelines
const getProductsWithSellerInfo = () => [
  {
    $match: { status: 'active' }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'sellerId',
      foreignField: '_id',
      as: 'seller'
    }
  },
  {
    $lookup: {
      from: 'sellerprofiles',
      localField: 'sellerId',
      foreignField: 'userId',
      as: 'sellerProfile'
    }
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  {
    $unwind: '$seller'
  },
  {
    $unwind: { path: '$sellerProfile', preserveNullAndEmptyArrays: true }
  },
  {
    $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
  },
  {
    $project: {
      title: 1,
      description: 1,
      price: 1,
      images: 1,
      condition: 1,
      location: 1,
      rating: 1,
      views: 1,
      createdAt: 1,
      'seller.name': 1,
      'sellerProfile.shopName': 1,
      'sellerProfile.rating': 1,
      'sellerProfile.verified': 1,
      'category.name': 1
    }
  }
];

const getTopSellersByRevenue = (limit = 10) => [
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'orderItems.sellerId',
      as: 'orders'
    }
  },
  {
    $unwind: '$orders'
  },
  {
    $unwind: '$orders.orderItems'
  },
  {
    $match: {
      'orders.orderItems.sellerId': { $exists: true },
      'orders.paymentStatus': 'paid'
    }
  },
  {
    $group: {
      _id: '$_id',
      sellerName: { $first: '$name' },
      totalRevenue: {
        $sum: {
          $multiply: ['$orders.orderItems.quantity', '$orders.orderItems.priceAtPurchase']
        }
      },
      totalOrders: { $sum: 1 },
      avgOrderValue: {
        $avg: {
          $multiply: ['$orders.orderItems.quantity', '$orders.orderItems.priceAtPurchase']
        }
      }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  },
  {
    $limit: limit
  }
];

const getCategoryWiseSales = () => [
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'orderItems.productId',
      as: 'orders'
    }
  },
  {
    $unwind: '$orders'
  },
  {
    $unwind: '$orders.orderItems'
  },
  {
    $match: {
      'orders.paymentStatus': 'paid'
    }
  },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  {
    $unwind: '$category'
  },
  {
    $group: {
      _id: '$category._id',
      categoryName: { $first: '$category.name' },
      totalSales: {
        $sum: {
          $multiply: ['$orders.orderItems.quantity', '$orders.orderItems.priceAtPurchase']
        }
      },
      totalQuantitySold: { $sum: '$orders.orderItems.quantity' },
      uniqueProducts: { $addToSet: '$_id' }
    }
  },
  {
    $addFields: {
      productCount: { $size: '$uniqueProducts' }
    }
  },
  {
    $project: {
      uniqueProducts: 0
    }
  },
  {
    $sort: { totalSales: -1 }
  }
];

// Order aggregation pipelines
const getOrdersWithDetails = (buyerId = null) => {
  const matchStage = { $match: {} };
  if (buyerId) {
    matchStage.$match.buyerId = new mongoose.Types.ObjectId(buyerId);
  }
  
  return [
    matchStage,
    {
      $lookup: {
        from: 'users',
        localField: 'buyerId',
        foreignField: '_id',
        as: 'buyer'
      }
    },
    {
      $unwind: '$buyer'
    },
    {
      $unwind: '$orderItems'
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'orderItems.sellerId',
        foreignField: '_id',
        as: 'seller'
      }
    },
    {
      $unwind: '$product'
    },
    {
      $unwind: '$seller'
    },
    {
      $group: {
        _id: '$_id',
        buyerInfo: { $first: '$buyer' },
        totalAmount: { $first: '$totalAmount' },
        orderStatus: { $first: '$orderStatus' },
        paymentStatus: { $first: '$paymentStatus' },
        createdAt: { $first: '$createdAt' },
        shippingAddress: { $first: '$shippingAddress' },
        orderItems: {
          $push: {
            product: '$product',
            seller: '$seller',
            quantity: '$orderItems.quantity',
            priceAtPurchase: '$orderItems.priceAtPurchase',
            status: '$orderItems.status'
          }
        }
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ];
};

// Analytics aggregation pipelines
const getDashboardStats = () => [
  {
    $facet: {
      totalUsers: [
        { $group: { _id: null, count: { $sum: 1 } } }
      ],
      usersByRole: [
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ],
      usersThisMonth: [
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]
    }
  }
];

const getRevenueAnalytics = (startDate, endDate) => [
  {
    $match: {
      paymentStatus: 'paid',
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      },
      dailyRevenue: { $sum: '$totalAmount' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
  }
];

module.exports = {
  getProductsWithSellerInfo,
  getTopSellersByRevenue,
  getCategoryWiseSales,
  getOrdersWithDetails,
  getDashboardStats,
  getRevenueAnalytics
};
