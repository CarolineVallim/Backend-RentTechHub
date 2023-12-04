const express = require("express");
const mongoose = require('mongoose');

/* Configure an Express Router for the Project Routes */
const router = express.Router();

const Cart = require('../models/Cart.model');

// Get list of orders for given User
router.get('/cart/user/:userId', async (req, res, next) => {
  const { userId } = req.params;

    const getOrders = await Cart.find({ user: userId }).populate({
      path: 'products',
      model: 'Product',
    });

    if (!getOrders || getOrders.length === 0) {
      console.log('No orders found for user:', userId);
      return res.status(404).json({ message: 'No Orders found for that user' });
    }
    res.json(getOrders);
});

router.patch('/cart/:userId/product/:productId', async (req, res)=>{
  const { userId, productId } = req.params;
  console.log(productId)
  const {total, shipping} = req.body;

  const newOrder = await Cart.findOneAndUpdate({ user: userId}, {$push: {products: productId}, total, shipping}, {new:true})

  res.json(newOrder);

})

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