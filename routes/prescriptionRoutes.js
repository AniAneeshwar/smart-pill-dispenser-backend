const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createPrescription,
  getPrescriptions,
  markDoseTaken
} = require("../controllers/prescriptionController");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("doctor"),
  createPrescription
);

router.get(
  "/my",
  authMiddleware,
  getPrescriptions
);

router.post(
  "/mark-taken",
  authMiddleware,
  roleMiddleware("patient"),
  markDoseTaken
);

module.exports = router;