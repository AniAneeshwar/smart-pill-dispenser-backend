const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({

  patient_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  caregiver_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  message:{
    type:String,
    required:true
  },

  is_read:{
    type:Boolean,
    default:false
  },

  created_at:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("Alert",alertSchema);