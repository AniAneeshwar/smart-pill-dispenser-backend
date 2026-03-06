const Prescription = require("../models/Prescription");
const DoseSchedule = require("../models/DoseSchedule");

exports.createPrescription = async (req, res) => {
  try {

    const {
      patient_id,
      medicine_name,
      dosage,
      frequency,
      start_date,
      end_date
    } = req.body;

    if (!patient_id || !medicine_name || !dosage || !frequency || !start_date || !end_date) {
      return res.status(400).json({
        message: "Missing required prescription fields"
      });
    }

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Only doctors can create prescriptions"
      });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        message: "Start date must be before end date"
      });
    }

    const prescription = new Prescription({
      doctor_id: req.user.id,
      patient_id,
      medicine_name,
      dosage,
      frequency,
      start_date,
      end_date
    });

    await prescription.save();

    const schedules = [];

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    let currentDate = new Date(startDate);

    const times = [8, 14, 20];

    while (currentDate <= endDate) {

      for (let i = 0; i < frequency; i++) {

        const scheduledTime = new Date(currentDate);
        scheduledTime.setHours(times[i], 0, 0);

        schedules.push({
          prescription_id: prescription._id,
          patient_id: patient_id,
          scheduled_time: scheduledTime
        });

      }

      currentDate.setDate(currentDate.getDate() + 1);

    }

    await DoseSchedule.insertMany(schedules);

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
      schedules_created: schedules.length
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



exports.getPrescriptions = async (req, res) => {
  try {

    let prescriptions;

    if (req.user.role === "doctor") {

      prescriptions = await Prescription.find({
        doctor_id: req.user.id
      });

    }

    else if (req.user.role === "patient") {

      prescriptions = await Prescription.find({
        patient_id: req.user.id
      });

    }

    else {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    res.json(prescriptions);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



exports.markDoseTaken = async (req, res) => {
  try {

    const { schedule_id } = req.body;

    if (!schedule_id) {
      return res.status(400).json({
        message: "Schedule ID is required"
      });
    }

    const schedule = await DoseSchedule.findById(schedule_id);

    if (!schedule) {
      return res.status(404).json({
        message: "Dose schedule not found"
      });
    }

    if (schedule.patient_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this dose"
      });
    }

    schedule.status = "taken";
    schedule.taken_time = new Date();

    await schedule.save();

    res.json({
      message: "Dose marked as taken",
      schedule
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};