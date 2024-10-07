import Coupon from '../models/coupon.model.js';

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log('Error in getCoupon controller ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    if (coupon.expiryDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    res.json({
      message: 'Coupon is valid',
      code: coupon.code,
      discountPercentage: coupon.discount,
    });
  } catch (error) {
    console.log('Error in validateCoupon controller ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
