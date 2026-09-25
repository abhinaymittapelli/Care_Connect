const ServiceCategory = require("../models/ServiceCategory");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const existingCategory = await ServiceCategory.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await ServiceCategory.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Single Category
const getCategoryById = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update Category
const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await ServiceCategory.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};