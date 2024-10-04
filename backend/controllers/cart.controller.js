import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map(product => {
      const item = req.user.cartItems.find(p => p.id === product.id);
      return { ...product._doc, quantity: item.quantity };
    });
    return res.json(cartItems);
  } catch (error) {
    console.log('Error in getCartProducts controller ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingProduct = user.cartItems.find(p => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cartItems.push({ product: productId });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log('Error in addToCart controller ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(p => p.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log('Error in removeAllFromCart controller ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingProduct = user.cartItems.find(p => p.id === productId);

    if (existingProduct) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(p => p.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingProduct.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(400).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.log('Error in updateQuantity controller ', error.message);
    res.json({ message: 'Server error', error: error.message });
  }
};
