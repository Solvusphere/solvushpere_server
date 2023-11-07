const { string } = require("joi");
const mongoose = require("mongoose");

const comapnyModel = new mongoose.Schema({
  company_name: {
    type: String,
    },
    
});

const Company = mongoose.model("companie", comapnyModel);

module.exports = Company;
