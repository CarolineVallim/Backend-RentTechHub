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

// Update your card by userId and put a new product in the cart
router.put('/cart/:userId/product/:productId', async (req, res)=>{
  const { userId, productId } = req.params;
  const {total, shipping} = req.body;

  const newOrder = await Cart.findOneAndUpdate({ user: userId}, {$push: {products: productId}, total, shipping}, {new:true})

  res.json(newOrder);

})

// Update total in the cart by userId
router.put('/cart/:userId/update-total', async (req, res) => {
  const { userId } = req.params;
  const { total } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { total: total },
      { new: true }
    );

    res.json(updatedCart);
  } catch (error) {
    console.error('An error occurred updating the cart total', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Delete only a single product
router.put('/cart/:cartId/:productId', async (req, res, next) => {
  const { cartId, productId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Please use valid IDs' });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    res.json({
      message: `Product with ID ${productId} was deleted from cart successfully`,
      updatedCart
    });
  } catch (error) {
    console.log('An error occurred deleting the product from the cart', error);
    next(error);
  }
});

// delete all products
router.delete('/cart/:cartId', async (req, res, next) => {
  const { cartId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: 'Please use a valid ID' });
    }

    const deletedCart = await Cart.findByIdAndDelete(cartId);

    res.json({
      message: `Cart with ID ${cartId} was deleted successfully`,
      deletedCart
    });
  } catch (error) {
    console.log('An error occurred deleting the cart', error);
    next(error);
  }
});


module.exports = router;