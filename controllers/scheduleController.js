const DoseSchedule = require("../models/DoseSchedule");
const Alert = require("../models/Alert");
const User = require("../models/User");

const mongoose = require("mongoose");
const moment = require("moment-timezone");

exports.getTodaySchedule = async (req, res) => {

  try {

    await exports.detectMissedDoses();

    const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();

   const schedules = await DoseSchedule.find({
   patient_id: req.user.id,
   scheduled_time: { $gte: todayStart, $lte: todayEnd }
  })
   .populate({
   path: "prescription_id",
   select: "medicine_name dosage"
 })
   .select("scheduled_time status prescription_id")
   .sort({ scheduled_time: 1 })
   .lean();

    const response = schedules.map(schedule => ({

      schedule_id: schedule._id,

      medicine_name: schedule.prescription_id.medicine_name,

      dosage: schedule.prescription_id.dosage,

      scheduled_time: moment(schedule.scheduled_time)
        .tz("Asia/Kolkata")
        .format("hh:mm A"),

      status: schedule.status

    }));

    res.json(response);

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

    const schedule = await DoseSchedule.findOne({
      _id: new mongoose.Types.ObjectId(schedule_id)
    });

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

exports.detectMissedDoses = async () => {

  const now = new Date();

  const missedSchedules = await DoseSchedule.find({
    scheduled_time: { $lt: now },
    status: "pending"
  });

  for (const schedule of missedSchedules) {

    schedule.status = "missed";

    await schedule.save();

    const patient = await User.findById(schedule.patient_id);

    if (patient && patient.caregiver_id) {

      await Alert.create({

        patient_id: patient._id,

        caregiver_id: patient.caregiver_id,

        message: `Patient ${patient.name} missed medicine scheduled at ${schedule.scheduled_time}`

      });

    }

  }

};

exports.getNextDose = async (req,res)=>{

  try{

    const now = new Date();

    const nextDose = await DoseSchedule.findOne({

      patient_id: req.user.id,
      scheduled_time: { $gte: now },
      status: "pending"

    })
    .sort({ scheduled_time: 1 })
    .populate("prescription_id");

    if(!nextDose){

      return res.json({
        message:"No upcoming doses"
      });

    }

    res.json({

      medicine_name: nextDose.prescription_id.medicine_name,

      dosage: nextDose.prescription_id.dosage,

      scheduled_time: moment(nextDose.scheduled_time)
        .tz("Asia/Kolkata")
        .format("hh:mm A"),

      status: nextDose.status

    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};

exports.getDoseHistory = async (req, res) => {

  try {

    const { patient_id } = req.params;

    if (req.user.role === "patient" && req.user.id !== patient_id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const schedules = await DoseSchedule
      .find({ patient_id })
      .populate("prescription_id")
      .sort({ scheduled_time: -1 })
      .limit(100);

    if (!schedules.length) {
      return res.json({
        message: "No history found"
      });
    }

    const history = schedules.map(schedule => ({

      schedule_id: schedule._id,

      medicine_name: schedule.prescription_id.medicine_name,

      scheduled_time: moment(schedule.scheduled_time)
        .tz("Asia/Kolkata")
        .format("DD MMM YYYY hh:mm A"),

      status: schedule.status,

      taken_time: schedule.taken_time
        ? moment(schedule.taken_time)
            .tz("Asia/Kolkata")
            .format("DD MMM YYYY hh:mm A")
        : null

    }));

    res.json({
      patient_id,
      history
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching history",
      error: error.message
    });

  }

};