const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Define a route to create a new order
router.post("/orders", (req, res) => {
  const { customerName, shippingAddress, paymentInfo, products } = req.body;

  // Create a new order document using the Order model
  const newOrder = new Order({
    customerName,
    shippingAddress,
    paymentInfo,
    products,
  });

  // Save the new order to the database
  newOrder.save((err) => {
    if (err) {
      console.error("Error saving order:", err);
      res.status(500).send("Error saving order");
    } else {
      res.send("Order saved successfully");
    }
  });
});

module.exports = router;
