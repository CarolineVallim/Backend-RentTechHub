const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId}
    }
  ],
  total: { type: Number },
  shipping: { type: Number }
});

const Cart = model('Cart', cartSchema);

module.exports = Cart;