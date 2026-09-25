const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");
// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome Admin!",
      user: req.user,
    });
  }
);


module.exports = router;