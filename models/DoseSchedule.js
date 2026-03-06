const mongoose = require("mongoose");

const doseScheduleSchema = new mongoose.Schema({

  prescription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    required: true,
    index: true
  },

  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  scheduled_time: {
    type: Date,
    required: true,
    index: true
  },
  
  taken_time: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ["pending", "taken", "missed"],
    default: "pending",
    index: true
  }

}, { timestamps: true });

doseScheduleSchema.index({ patient_id: 1, scheduled_time: 1 });

module.exports = mongoose.model("DoseSchedule", doseScheduleSchema);