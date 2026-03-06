const User = require("../models/User");
const DoseSchedule = require("../models/DoseSchedule");
const { detectMissedDoses } = require("./scheduleController");

exports.getDoctorPatients = async (req, res) => {

  try {

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    await detectMissedDoses();

    const patients = await User.find({ role: "patient" }).select("name");

    const result = [];

    for (const patient of patients) {

      const totalDoses = await DoseSchedule.countDocuments({
        patient_id: patient._id
      });

      const takenDoses = await DoseSchedule.countDocuments({
        patient_id: patient._id,
        status: "taken"
      });

      const missedDoses = await DoseSchedule.countDocuments({
        patient_id: patient._id,
        status: "missed"
      });

      let adherence = 0;

      if (totalDoses > 0) {
        adherence = (takenDoses / totalDoses) * 100;
      }

      result.push({
        patient_name: patient.name,
        patient_id: patient._id,
        adherence: adherence.toFixed(2),
        taken_doses: takenDoses,
        missed_doses: missedDoses
      });

    }

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};