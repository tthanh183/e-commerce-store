import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

export const getAnalyticsData = async (req, res) => {
  const totalUser = await User.countDocuments();
  const totalProduct = await Product.countDocuments();
  const saleData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSale: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ]);
  const { totalSales, totalRevenue } = saleData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUser,
    products: totalProduct,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateArray = getDatesArray(startDate, endDate);

    return dateArray.map(date => {
      const foundData = dailySalesData.find(item => item._id === date);
      return {
        date,
        totalSale: foundData ? foundData.sales : 0,
        revenue: foundData ? foundData.revenue : 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesArray(startDate, endDate) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
