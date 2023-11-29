/* Require NPM Packages */
const express = require("express");
const mongoose = require("mongoose");

/* Configure an Express Router for the Project Routes */
const router = express.Router();

/* Require the Project Model */
const Product = require("../models/Product.model");

/* ROUTES */

// POST - Creates a new product
router.post("/products/new", (req, res) => {
  const { name, image, description, rentalPrice, stock } = req.body;

  Product.create({ name, image, description, rentalPrice, stock })
    .then((response) => res.json(response))
    .catch((error) => res.json(error));
});

// GET - Reads all products
router.get("/products", (req, res) => {
  Product.find()
    .then((allProducts) => res.json(allProducts))
    .catch((error) => res.json(error));
});


// GET - Reads a specific product
router.get("/products/:productId", (req, res) => {
  const {productId} = req.params;
  Product.findById(productId)
    .then((product) => res.json(product))
    .catch((error) => res.json(error));
});


// PUT - Updates a specific product
router.put("/products/:productId", (req, res) => {
  const {productId} = req.params;
  const {name, image, description, rentalPrice, stock} = req.body;

  Product.findByIdAndUpdate(productId, { name, image, description, rentalPrice, stock }, { new: true })
    .then(() => {
      res.json({ message: "Product Updated!" });
    })
    .catch((error) => {
      res.json({ message: "Failed to Update Product." });
    });
});


// DELETE - Delete a specific product
router.delete('/products/:productId', (req,res)=>{
    const {productId} = req.params; 

    Product.findByIdAndDelete(productId)
        .then(()=>{
            res.json({message: 'Product deleted'});
        })
        .catch(()=>{
            res.json({error: 'Failed to delete a Product'});
        })
})

/* Export the router */
module.exports = router;
