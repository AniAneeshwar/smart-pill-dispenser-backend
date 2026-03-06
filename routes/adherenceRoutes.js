const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAdherence,
  getWeeklyReport,
  getChartData
} = require("../controllers/adherenceController");

router.get(
  "/patient/:patient_id",
  authMiddleware,
  roleMiddleware("doctor"),
  getAdherence
);

router.get(
  "/report/:patient_id",
  authMiddleware,
  roleMiddleware("doctor"),
  getWeeklyReport
);

router.get(
  "/chart/:patient_id",
  authMiddleware,
  roleMiddleware("doctor","patient"),
  getChartData
);

module.exports = router;