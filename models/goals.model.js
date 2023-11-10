const mongoose = require("mongoose");

const GoalsModel = new mongoose.Schema({
  solution: {
    type: String,
    required: true,
    index: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    index: true,
  },
});

let Goals = mongoose.model("goals", GoalsModel);
module.exports = Goals;
