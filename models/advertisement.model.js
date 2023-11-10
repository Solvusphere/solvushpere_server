const mongoose = require("mongoose");
const advertisementModel = new mongoose.Schema({
  compony_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "componies",
  },
  videos: [
    {
      link: {
        type: String,
      },
      token: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],
  images: [
    {
      link: {
        type: String,
      },
      token: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  ],

});

let Advertisement = mongoose.model("advertisement", advertisementModel);

module.exports = Advertisement;
