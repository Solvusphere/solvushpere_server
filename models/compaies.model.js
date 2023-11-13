const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  visite_count: {
    type: Number,
    default: 0,
  },
  lastVisitedTimestamp: {
    type: Date,
    default: null,
  },
});

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
  verified: {
    type: Boolean,
    required: true,
  },

  founder: {
    type: String,
    // required: true,
  },
  logo: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  goals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "goals",
    // required: true,
  },
  web_url: {
    type: String,
    // required: true,
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "industries",
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
  lastVisitedTimestamp: {
    type: Date,
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
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
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
  paid_amount: {
    type: Number,
    required: true,
    default: 0,
  },
  remining_slots: {
    big: {
      type: Number,
      default: 0,
    },
    small: {
      type: Number,
      default: 0,
    },
  },
});

const Company = mongoose.model("companies", comapnyModel);

module.exports = Company;
