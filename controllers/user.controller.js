const { sendEmail } = require("../auth/email/nodemailer.auth");
const redis = require("../connections/redis.connection");
const { commonErrors } = require("../middlewares/error/commen.error");
const User = require("../models/user.model");
const {
  validateOtp,
  validateEmail,
} = require("../validations/user.validation");
const bcrypt = require("bcrypt");
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
};
module.exports = UserController;
