const Admin = require('../../models/admin.model')
const Jwt = require('jsonwebtoken') 
const Joi = require('joi')
const { hashPassword,campare } = require('../../utils/bcrypt')
const { Validate } = require('../../validations/admin.validation')
const { commonErrors } = require('../../middlewares/error/commen.error')
const {sendEmail} = require('../../auth/email/nodemailer.auth')
const { setObject,redisGet } = require('../../connections/redis.connection') 
const {verifyOtp} = require('../../auth/email/otp.auth')
const Company = require('../../models/compaies.model')
const User = require('../../models/users.model')

const requirments = {
  number: Joi.number().min(10).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(3).required(),
  otp: Joi.number().required(),
};

const adminController = {
  

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
};

module.exports = adminController;
