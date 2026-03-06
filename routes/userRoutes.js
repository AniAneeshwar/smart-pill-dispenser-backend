const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { updateAccessibility } = require("../controllers/userController");

router.put(
  "/accessibility",
  authMiddleware,
  roleMiddleware("doctor","patient","caregiver"),
  updateAccessibility
);

module.exports = router;