const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
    firstName: {
      type: String,
      required: true},
    lastName: {
      type: String, 
      required: true},
    email: { 
      type: String, 
      required: true, 
      unique: true },
    password: { 
      type: String, 
      required: true },
    imageProfile: {
      type: String
    },
    address: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }}
);

const User = model("User", userSchema);

module.exports = User;
