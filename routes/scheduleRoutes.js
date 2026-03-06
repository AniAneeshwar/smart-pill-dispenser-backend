const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getTodaySchedule,
  markDoseTaken,
  getNextDose,
  getDoseHistory
} = require("../controllers/scheduleController");

router.get(
  "/today",
  authMiddleware,
  roleMiddleware("patient"),
  getTodaySchedule
);

router.post(
  "/taken",
  authMiddleware,
  roleMiddleware("patient"),
  markDoseTaken
);

router.get(
  "/next-dose",
  authMiddleware,
  roleMiddleware("patient"),
  getNextDose
);

router.get(
  "/history/:patient_id",
  authMiddleware,
  roleMiddleware("doctor","patient"),
  getDoseHistory
);

module.exports = router;