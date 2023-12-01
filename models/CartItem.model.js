const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const cartItemSchema = new Schema({
    id: '',
    name: '',
    price: 0,
    quantity: 0,   
});

module.exports = model("CartItem", cartItemSchema);