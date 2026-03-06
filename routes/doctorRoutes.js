const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getDoctorPatients } = require("../controllers/doctorController");

router.get(
  "/patients",
  authMiddleware,
  roleMiddleware("doctor"),
  getDoctorPatients
);

module.exports = router;