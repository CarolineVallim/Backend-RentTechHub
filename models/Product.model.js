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
});

module.exports = model("Product", productSchema);