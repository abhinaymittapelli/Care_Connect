const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Anyone can view categories
router.get("/", getCategories);

router.get("/:id", getCategoryById);

// Only admin can create
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

// Only admin can update
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCategory
);

// Only admin can delete
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

module.exports = router;