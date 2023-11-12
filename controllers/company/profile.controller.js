const Company = require("../../models/compaies.model");
const Joi = require("joi");
const { commonErrors } = require("../../middlewares/error/commen.error");
const Jwt = require("jsonwebtoken");
const { Validate } = require("../../validations/company.validation");
const Goals = require("../../models/goals.model");
const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
  document: Joi.string().required(),
  number: Joi.number().required(),
  founder: Joi.string().min(3).max(20).required(),
  logo: Joi.string().required(),
  web_url: Joi.string().required(),
  industry: Joi.string().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  solution: Joi.string().required().min(4),
};

const ProfileController = {
  async fetching_Profile(req, res) {
    try {
      const { id } = req.body;
      const data = await Company.findOne({ _id: id });
      if (!data) return commonErrors(res, 404, { message: "Data Not Found" });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },
  async changingSolution(req, res) {
    try {
      let { solution, id } = req.body;
      // let {id}=req.header.company 
      let validatingSolution = Validate(
        { solution: requirments.solution },
        solution
      );
      if (!validatingSolution.status)
        return commonErrors(res, 404, {
          message: validatingSolution.response[0].message,
        });
      let changinData = await Goals.findOne(
        { company_id: id },
        { $set: { solution: solution } }
      );
      if (!changinData)
        return commonErrors(res, 400, {
          message: "somthing went worng, Your cahnges not saved ",
        });

      return res.satus(200).send({ message: "changes are saved, Thank you " });
    } catch (error) {
      console.log(error);
      return commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },

  async edit_Profile(req, res) {
    try {
      const {} = req.body;
    } catch (error) {
      console.log(error);
      return commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },
};

module.exports = ProfileController;
