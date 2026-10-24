
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// CREATE a new order
const createOrder = async (req, res) => {
  try {
    const { customer, date, productDetails } = req.body;

    // Validate required fields
    if (!customer || !Array.isArray(productDetails) || productDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and at least one product are required",
      });
    }

    // Validate products and calculate the total on the server
    let totalAmount = 0;
    const validatedDetails = [];

    for (const item of productDetails) {
      if (!mongoose.isValidObjectId(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}`,
        });
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity is 0",
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Use the product's saved price rather than trusting the client
      const price = product.unitPrice;

      totalAmount += price * item.quantity;

      validatedDetails.push({
        product: product._id,
        quantity: item.quantity,
        price,
      });
    }

    const order = await Order.create({
      customer,
      ...(date && { date }),
      totalAmount,
      productDetails: validatedDetails,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("productDetails.product");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// READ all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("productDetails.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// READ one order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("productDetails.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

// UPDATE an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, date, productDetails } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (customer !== undefined) {
      order.customer = customer;
    }

    if (date !== undefined) {
      order.date = date;
    }

    // If products change, validate them and recalculate the total
    if (productDetails !== undefined) {
      if (
        !Array.isArray(productDetails) ||
        productDetails.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one product is required",
        });
      }

      let totalAmount = 0;
      const validatedDetails = [];

      for (const item of productDetails) {
        if (!mongoose.isValidObjectId(item.product)) {
          return res.status(400).json({
            success: false,
            message: `Invalid product ID: ${item.product}`,
          });
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
          return res.status(400).json({
            success: false,
            message: "Quantity must be a whole number greater than 0",
          });
        }

        const product = await Product.findById(item.product);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
        }

        const price = product.unitPrice;

        totalAmount += price * item.quantity;

        validatedDetails.push({
          product: product._id,
          quantity: item.quantity,
          price,
        });
      }

      order.productDetails = validatedDetails;
      order.totalAmount = totalAmount;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("productDetails.product");

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// DELETE an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
