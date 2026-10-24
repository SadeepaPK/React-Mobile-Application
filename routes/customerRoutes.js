const express = require("express")
const router = express.Router();

// Import authentication controllers
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Import authentication middleware
const authMiddleware = require("../middleware/auth");

router.route('/')
.get(authMiddleware, getAllCustomers)
.post(authMiddleware, createCustomer)

router.route('/:id')
.get(authMiddleware, getCustomerById)
.update(authMiddleware, updateCustomer)
.delete(authMiddleware, deleteCustomer)

module.exports = router;

