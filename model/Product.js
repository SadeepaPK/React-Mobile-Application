
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"],
    },

    qtyOnHand: {
      type: Number,
      required: [true, "Quantity on hand is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
