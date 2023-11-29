const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
    name: {
      type: String, 
      required: true},
    email: { 
      type: String, 
      required: true, 
      unique: true },
    password: { 
      type: String, 
      required: true },
    address: { 
        type: String, 
        required: true },
    rentals: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Rental' }],}
);

const User = model("User", userSchema);

module.exports = User;
