// routes.js

const express = require("express");
const router = express.Router();

// Import your order controller
const { createOrder } = require("../controllers/orderController");

// Create a new order route
router.post("/orders", createOrder);

module.exports = router;
