const express = require("express")
const router = express.Router();

// Import authentication controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Import authentication middleware
const authMiddleware = require("../middleware/auth");

router.route('/')
.get(authMiddleware, getAllProducts)
.post(authMiddleware, createProduct)

router.route('/:id')
.get(authMiddleware, getProductById)
.update(authMiddleware, updateProduct)
.delete(authMiddleware, deleteProduct)

module.exports = router;

