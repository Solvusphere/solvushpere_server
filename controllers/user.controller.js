const { sendEmail } = require("../auth/email/nodemailer.auth");
const redis = require("../connections/redis.connection");
const { commonErrors } = require("../middlewares/error/commen.error");
const User = require("../models/user.model");

const bcrypt = require("bcrypt");
=======
const { LoginValidate, validateOtp,
  validateEmail, } = require("../validations/user.validation");
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

const UserController = {
  async verifyEmail(req, res) {
    try {
      const { username, email } = req.body;
      let userData = {
        username: username,
        email: email,
      };
      let validating = validateEmail(userData);

      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let authenticateEmail;
      sendEmail(userData.email).then(async (response) => {
        authenticateEmail = response;
        if (authenticateEmail.status == false)
          return commonErrors(res, { error: "Email is not validated" });
        let OTP = authenticateEmail.otp;
        let userdata = {
          email: userData.email,
          username: userData.username,
          otp: OTP,
        };
        let savingToredis = await redis.setObject(userdata);
        if (savingToredis == false)
          return res.status(404).send({ error: "Internal server error" });
        res.status(200).send("Successfully registered");
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },

  async verifyOtp(req, res) {
    try {
      let enteredotp = req.body.otp;
      let validatingOtp = validateOtp({ otp: enteredotp });
      if (!validatingOtp.status)
        return commonErrors(res, { error: "Please enter otp" });
      let takeUserdata = await redis.redisGet(`${enteredotp}`);
      if (!takeUserdata)
        return commonErrors(res, {
          error: "Invalide Otp,Please resend the otp again ",
        });
      let { otp } = JSON.parse(takeUserdata);
      if (!otp)
        return commonErrors(res, {
          error: "Invalide Otp, resend the otp again again ",
        });
      if (otp != enteredotp)
        return commonErrors(res, { error: "Please cheak your otp " });
      
        
      res.status(200).send("Otp if verified");
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },
  async login(req, res){
    try {
    
      const { email, password } = req.body;
      const userData = {
        email: email,
        password: password
      }

      const validating = LoginValidate(userData)
      if (!validating.status)
        return res.status(400).send(validating.response[0].message);
    
      let user = await User.findOne({ email: email });
      if (!user)
        return res.status(404).send("User Not Found");

      let isValidPassword = bcrypt.compare(password, user.password);
      if (!isValidPassword)
        return res.status(400).send("Password Doesn't Match");
      const payload = { _id: user._id, name: user.username, email: user.email };
      
    let token = Jwt.sign(payload, "#$solvusphere$#");
    return res.status(200).send("Login Successfully",token,user)
    
  } catch (error) {
    console.log(error);
  }
  }

};
module.exports = UserController;
