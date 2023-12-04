const express = require("express");
const mongoose = require('mongoose');

/* Configure an Express Router for the Project Routes */
const router = express.Router();

const Cart = require('../models/Cart.model');

// Create Order
router.post('/cart', async (req, res, next) => {
  const { products, user: userId, total, shipping } = req.body;

  try {
    const newOrder = await Cart.create({
      products,
      user: userId,
      total,
      shipping
    });

    res.json(newOrder);
  } catch (error) {
    console.log('An error occurred creating a new product', error);
    next(error);
  }
});

// Get list of orders for given User
router.get('/cart/user/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    console.log('Fetching orders for userId:', userId);
    const getOrders = await Cart.find({ user: userId }).populate({
      path: 'products.product',
      model: 'Product',
    });
    console.log('Orders retrieved:', getOrders);

    if (!getOrders || getOrders.length === 0) {
      console.log('No orders found for user:', userId);
      return res.status(404).json({ message: 'No Orders found for that user' });
    }
    res.json(getOrders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    next(error);
  }
});

router.delete('/cart/:cartId', async (req, res, next) => {
  const { cartId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: 'Please use a valid ID' });
    }
    const deleteOrder = await Cart.findByIdAndDelete(cartId, {
      new: true
    });
    res.json({
      message: `Order with ID ${cartId} was deleted successfully`
    });
  } catch (error) {
    console.log('An error occurred deleting the order', error);
    next(error);
  }
});

module.exports = router;