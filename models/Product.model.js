const mongoose = require('mongoose');
const {Schema, model} = mongoose; 

const productSchema = new Schema({
    name: { 
        type: String, 
        required: true },
    description: { 
        type: String,
        required: true },
    image: {
        type: String
    },
    rentalPrice: { 
        type: Number, 
        required: true },
    stock: { 
        type: Number, 
        required: true },
    user:{ 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true }
});

const Product = model("Product", productSchema);

module.exports = Product