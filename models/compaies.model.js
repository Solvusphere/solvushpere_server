const mongoose = require("mongoose");

const comapnyModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    // required: true,
  },
  logo: {
    type: String,
    // required: true,
  },
  main_image: {
    type: String,
    // required: true,
  },
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  web_url: {
    type: String,
    // required: true,
  },
  industry: {
    type: String,
    // required: true,
  },
  document: {
    type: String,
    // required: true,
  },
  services: [
    {
      image: {
        type: String,
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      description: {
        type: String,
        // required: true,
      },
    },
  ],
  advertiesments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "",
  },
  visite_count: {
    type: Number,
  },
  account_status: {
    type: Boolean,
    // required: true,
    default: false,
  },
  registration_data: {
    type: Date,
    // required: true,
  },
  latest_update_data: {
    type: Date,
    // required: true,
  },
  follows: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  views: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

const Company = mongoose.model("companies", comapnyModel);

module.exports = Company;
