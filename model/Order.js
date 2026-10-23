
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, "Customer is required"],
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    productDetails: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },

        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be a whole number",
          },
        },

        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: [0, "Price cannot be negative"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
