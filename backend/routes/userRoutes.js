const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require("../controller/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id").get(protect, getUserById);

module.exports = router;
