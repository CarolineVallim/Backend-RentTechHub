const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    { type: Schema.Types.ObjectId, 
      ref: 'Product'}
  ],
  total: { type: Number },
  shipping: { type: Number }
});

const Cart = model('Cart', cartSchema);

module.exports = Cart;