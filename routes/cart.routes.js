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
  const {total, shipping} = req.body;

  const newOrder = await Cart.findOneAndUpdate({ user: userId}, {$push: {products: productId}, total, shipping}, {new:true})

  res.json(newOrder);

})

// Delete only a single product
router.delete('/cart/:cartId/:productId', async (req, res, next) => {
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