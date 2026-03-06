const DoseSchedule = require("../models/DoseSchedule");
const Prescription = require("../models/Prescription");

exports.getAdherence = async (req, res) => {
  try {

    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        message: "Patient ID is required"
      });
    }

    const prescriptions = await Prescription.find({ patient_id });

    if (!prescriptions.length) {
      return res.json({
        patient_id,
        message: "No prescriptions found",
        total_doses: 0,
        taken_doses: 0,
        missed_doses: 0,
        adherence_percentage: "0.00"
      });
    }

    const prescriptionIds = prescriptions.map(p => p._id);

    const totalDoses = await DoseSchedule.countDocuments({
      prescription_id: { $in: prescriptionIds }
    });

    const takenDoses = await DoseSchedule.countDocuments({
      prescription_id: { $in: prescriptionIds },
      status: "taken"
    });

    const missedDoses = await DoseSchedule.countDocuments({
      prescription_id: { $in: prescriptionIds },
      status: "missed"
    });

    let adherence = 0;

    if (totalDoses > 0) {
      adherence = (takenDoses / totalDoses) * 100;
    }

    res.json({
      patient_id,
      total_doses: totalDoses,
      taken_doses: takenDoses,
      missed_doses: missedDoses,
      adherence_percentage: adherence.toFixed(2)
    });

  } catch (error) {

    res.status(500).json({
      message: "Error calculating adherence",
      error: error.message
    });

  }
};

exports.getWeeklyReport = async (req, res) => {

  try {

    const { patient_id } = req.params;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const schedules = await DoseSchedule.find({
      patient_id,
      scheduled_time: { $gte: sevenDaysAgo }
    });

    if (!schedules.length) {
      return res.json({
        message: "No schedule data found"
      });
    }

    const report = {};

    schedules.forEach(schedule => {

      const date = schedule.scheduled_time.toISOString().split("T")[0];

      if (!report[date]) {
        report[date] = {
          taken: 0,
          missed: 0
        };
      }

      if (schedule.status === "taken") {
        report[date].taken += 1;
      }

      if (schedule.status === "missed") {
        report[date].missed += 1;
      }

    });

    const formattedReport = Object.keys(report).map(date => ({
      date,
      taken: report[date].taken,
      missed: report[date].missed
    }));

    res.json({
      patient_id,
      report: formattedReport
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.getChartData = async (req,res)=>{

  try{

    const { patient_id } = req.params;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const schedules = await DoseSchedule.find({
      patient_id,
      scheduled_time: { $gte: thirtyDaysAgo }
    }).sort({ scheduled_time: 1 });

    const chartData = {};

    schedules.forEach(s => {

      const date = s.scheduled_time.toISOString().split("T")[0];

      if(!chartData[date]){
        chartData[date]=0;
      }

      if(s.status === "taken"){
        chartData[date]+=1;
      }

    });

    res.json(chartData);

  }catch(error){

    res.status(500).json({error:error.message});

  }

};