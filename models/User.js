const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    index: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ["doctor", "patient", "caregiver"],
    required: true,
    index: true
  },

  accessibility_mode: {
    type: String,
    enum: ["normal", "vision_impaired", "hearing_impaired"],
    default: "normal"
  },

  language: {
    type: String,
    default: "en"
  },

  phone: {
    type: String,
    default: null,
    trim: true
  },

  caregiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);