const Admin = require('../../models/admin.model')
const Jwt = require('jsonwebtoken') 
const Joi = require('joi')
const { hashPassword,campare } = require('../../utils/bcrypt')
const { Validate } = require('../../validations/admin.validation')
const { commonErrors } = require('../../middlewares/error/commen.error')
const {sendEmail} = require('../../auth/email/nodemailer.auth')
const { setObjectWithExp, redisGet } = require("../../connections/redis.connection"); 
const {verifyOtp} = require('../../auth/email/otp.auth')
const Company = require('../../models/compaies.model')
const User = require('../../models/users.model')
const Industry = require("../../models/industry.model");

const requirments = {
  number: Joi.number().min(10).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(3).required(),
  otp: Joi.number().required(),
  industry: Joi.string().required(),
};

  async verifyEmail(req, res) {
    const { email } = req.body;
    let validating = Validate({ email: requirments.email }, { email });
    if (!validating)
      return commonErrors(res, 400, {
        message: validating.response[0].message,
      });

    sendEmail(email).then((responses) => {
      if (!res.status)
        return commonErrors(res, 404, {
          response: "otp has been not sended, Please try again ",
        });
      let otp = responses.otp;
      let validationData = {
        email: email,
        otp: otp,
        verified: false,
      };
      let storingOtp = setObjectWithExp(validationData);
      if (storingOtp == false)
        return commonErrors(res, 404, {
          response: "Somthing went worng, please refresh and try again",
        });
      res.status(200).send({ message: "sucessfully sended Otp" });
    });
  },

  async verifyOtp(req, res) {
    try {
      let { otp } = req.body;
      let validateOtp = Validate({ otp: requirments.otp }, { otp: otp });
      if (!validateOtp.status)
        return commonErrors(res, 404, {
          message: validateOtp.response[0].message,
        });
      let varifyingotp = await verifyOtp(otp);
      if (varifyingotp.status == false)
        return commonErrors(res, 404, {
          message: varifyingotp.message,
        });

      res.send({ message: varifyingotp.message, otp });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },

  async registration(req, res) {
    try {
      const { email, password, name, number, otp } = req.body;
      let retriveotp = await redisGet(JSON.stringify(otp));

      if (!retriveotp) {
        return commonErrors(res, 400, {
          message: "Please verify your email agin",
        });
      }
      let parsedData = JSON.parse(retriveotp);
      if (!parsedData.verified)
        return commonErrors(res, 400, {
          message:
            "This details not verified, Please verify your email for further process otp",
        });

      let adminData = {
        name: name,
        email: email,
        number: number,
        password: password,
      };

      let validating = Validate(
        {
          name: requirments.name,
          email: requirments.email,
          number: requirments.number,
          password: requirments.password,
        },
        adminData
      );

      if (!validating.status)
        return commonErrors(res, 400, {
          message: validating.response[0].message,
        });

      let encryptpassword = await hashPassword(password, parsedData.email);
      if (!encryptpassword)
        return commonErrors(res, 400, {
          message: "somthing went worng try again",
        });

      let registeringData = {
        name: name,
        email: parsedData.email,
        number: number,
        password: encryptpassword,
      };

      let registeringIntially = new Admin(registeringData);

      await registeringIntially.save();
      res
        .status(200)
        .send({ message: " Registration completed, Welcome to Solvusphere" });
    } catch (error) {
      console.log(error);
      commonErrors(error, 500, { message: "Interanl Server Error" });
    }
  },


  async login(req, res) {
    try {
      const { email, password } = req.body;
      const adminData = {
        email: email,
        password: password,
      };
      const validating = Validate(
        { email: requirments.email, password: requirments.password },
        adminData
      );
      if (!validating.status)
        return commonErrors(res, 400, validating.response[0].message);

      const admin = await Admin.findOne({ email: email });
      console.log(admin);
      if (!admin)
        return commonErrors(res, 404, {
          message: "Please Register Your admin",
        });

      const isValidPassword = await campare(password, email, admin.password);
      if (!isValidPassword)
        return commonErrors(res, 400, { message: "Password Doesn't Match" });

      const payload = { _id: admin._id, name: admin.name, email: admin.email };
      
      // setup of access token and refresh token
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      let token = { accessToken, refreshToken }
      
      return commonErrors(res, 200, {
        message: "Login Successfully",
        token,
        admin,
      });
    } catch (error) {
      console.log(error);
      return commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },
  async create_insustry(req, res) {
    try {
      let { industry } = req.body;
      let trimData = industry.trim();
      let validateData = Validate(
        { industry: industry },
        { industry: trimData }
      );
      if (!validateData)
        return commonErrors(res, 404, {
          message: "Invalide data, Please fill the field  ",
        });
      let insetingData =await  Industry.findOneAndUpdate(
        { name: trimData },
        { name: trimData },
        { new: true, upsert: true }
      );
      if (!insetingData)
        return commonErrors(res, 404, {
          message: "Internal server error, Please refresh the page and try it ",
        });
      return res.status(200).send({ messge: "New industry is added " });
    } catch (error) {
      console.log(error);
      return commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },
};

module.exports = adminController;
