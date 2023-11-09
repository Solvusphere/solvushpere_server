const mongoose = require("mongoose");

const GoalsModel = new mongoose.Schema({
  solution: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  company_id: {
    tyrp: mongoose.Schema.Types.ObjectId,
    ref: "companies",
  },
});

let Goals = mongoose.model("goals", GoalsModel);
module.exports = Goals;
