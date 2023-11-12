const mongoose = require("mongoose");

const IndustryModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
});

let Industry = mongoose.model("industries", IndustryModel);
module.exports = Industry;