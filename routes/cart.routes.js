const router = require('express').Router();
const Order = require('../models/Cart.model');
const mongoose = require('mongoose');

// Create Order
router.post('/cart', async (req, res, next) => {
  const { user, products, total, shipping } = req.body;

  try {
    const newOrder = await Order.create({
      user,
      products,
      total,
      shipping
    });

    res.json(newOrder);
  } catch (error) {
    console.log('An error occurred creating a new product', error);
    next(error);
  }
});

// Get Details of an order

router.get('/cart/:cartId', async (req, res, next) => {
  const { orderId } = req.params;

  try {
    //check if ID is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Please use a valid ID' });
    }

    const getOrder = await Order.findById(orderId).populate(
      'products store user products.product'
    );

    if (!getOrder) {
      return res.status(404).json({ message: 'No Order found with that ID' });
    }
    res.json(getOrder);
  } catch (error) {
    console.log('There was an error retrieving the Order', error);
    next(error);
  }
});

// Get list of orders for given User

router.get('/cart/user/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const getOrders = await Order.find({ user: userId }).populate(
      'products store products.product'
    );

    if (!getOrders) {
      return res.status(404).json({ message: 'No Orders found for that user' });
    }
    res.json(getOrders);
  } catch (error) {
    console.log('There was an error retrieving the Order', error);
    next(error);
  }
});


router.delete('/cart/:cartId', async (req, res, next) => {
  const { orderId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Please use a valid ID' });
    }
    const deleteOrder = await Order.findByIdAndDelete(orderId, {
      new: true
    });
    res.json({
      message: `Order with ID ${orderId} was deleted successfully`
    });
  } catch (error) {
    console.log('An error occurred deleting the order', error);
    next(error);
  }
});

module.exports = router;