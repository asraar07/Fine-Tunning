const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentInfo: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);
