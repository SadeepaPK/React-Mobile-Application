const express = require("express")
const router = express.Router();

// Import authentication controllers
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");

// Import authentication middleware
const authMiddleware = require("../middleware/auth");

router.route('/')
.get(authMiddleware, getAllOrders)
.post(authMiddleware, createOrder)

router.route('/:id')
.get(authMiddleware, getOrderById)
.update(authMiddleware, updateOrder)
.delete(authMiddleware, deleteOrder)

module.exports = router;

