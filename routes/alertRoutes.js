const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Alert = require("../models/Alert");

router.get(
  "/caregiver",
  authMiddleware,
  roleMiddleware("caregiver"),
  async (req, res) => {

    try {

      const alerts = await Alert.find({
        caregiver_id: req.user.id
      })
      .populate("patient_id", "name")
      .sort({ created_at: -1 });

      res.json(alerts);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);

module.exports = router;