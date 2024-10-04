import express from 'express';

import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateQuantity,
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartProducts);
router.post('/', protectRoute, addToCart);
router.post('/delete', protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);
export default router;
