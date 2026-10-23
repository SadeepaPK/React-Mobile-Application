const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Email address is address"]
    },

    salary: {
      type: Number,
      required: [true, "salery address is required"],
      min: 0
    }
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
