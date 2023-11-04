const { sendEmail } = require("../auth/email/nodemailer.auth");
const client = require("../connections/redis.connection");
const User = require("../models/user.model");
const { Validate } = require("../validations/user.validation");
const bcrypt = require("bcrypt");

const UserController = {
  async register(req, res) {
    try {
      const { name, email } = req.body;
      let userData = {
        username: name,
        email: email,
      };
      let validating = Validate(userData);

      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let authenticateEmail;
      sendEmail(userData.email).then((response) => {
        authenticateEmail = response;
        if (authenticateEmail.status == false)
          return res.status(400).send({ error: "Email is not validated" });

        let OTP = authenticateEmail.otp;
        client.set(`${userData.email}:${OTP}`, `${OTP}`).then((ress) => {
          console.log(ress);
        });
        client.get(`${userData.email}:${OTP}`, (err, res) => {
          if (err) {
            console.error(err);
          } else {
            console.log(res + " OTP");
          }
        });
        //  setTimeout(() => {
        //    client.del(`${userData.email}:${OTP}`, (err, result) => {
        //      if (err) {
        //        console.error(err);
        //      } else {
        //        console.log(result);
        //      }

        //      // Now you can close the client
        //      client.quit();
        //    });
        //  }, 30000);
        res.status(200).send("Successfully registered");
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },
  async login(req, res) {
    try {
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = UserController;
