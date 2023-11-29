const mongoose = require('mongoose');
const {Schema, model } = mongoose; 

const rentalSchema = new Schema({
    product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product' },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' },
    startDate: { 
        type: Date, 
        required: true },
    endDate: { 
        type: Date, 
        required: true },
    totalAmount: { 
        type: Number, 
        required: true },
})

module.exports = model("Rental", rentalSchema);