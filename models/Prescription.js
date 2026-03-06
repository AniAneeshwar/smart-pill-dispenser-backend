const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  medicine_name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);