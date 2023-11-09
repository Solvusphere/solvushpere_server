const {
  setObject,
  redisGet,
  redisDel,
} = require("../../connections/redis.connection");
const User = require("../../models/users.model");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const { Validate } = require("../../validations/user.validation");
const { hashPassword, campare } = require("../../utils/bcrypt");
const { commonErrors } = require("../../middlewares/error/commen.error");
const { sendEmailAsLink } = require("../../auth/email/link.auth");

const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
};

const UserController = {
  async verifyEmail(req, res) {
    try {
      const { username, email } = req.body;
      let userData = {
        username: username,
        email: email,
      };
      let validating = Validate(
        { username: requirments.username, email: requirments.email },
        userData
      );
      let existingEmail = await User.findOne({ email: email });
      if (existingEmail)
        return commonErrors(res, 409, {
          warning: "Your aready registered with this email",
        });
      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let authenticateEmail;
      sendEmailAsLink(userData.email).then(async (response) => {
        authenticateEmail = response;
        console.log(authenticateEmail);
        if (authenticateEmail.status == false)
          return commonErrors(res, 400, { error: "Email is not validated" });
        let userdata = {
          email: userData.email,
          username: userData.username,
        };
        setObject(userdata);
        res.status(200).send({
          message: "Verification link has been sented into your email",
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },

  async registering(req, res) {
    try {
      let { password, email } = req.body;
      let validating = Validate(
        { password: requirments.password },
        { password: password }
      );
      if (!validating.status)
        return commonErrors(res, 404, {
          error: validating.response[0].message,
        });
      let hashingpassword = await hashPassword(password, email);
      if (!hashingpassword)
        return commonErrors(res, 500, {
          error: "internal server error",
        });
      let userdata = await redisGet(email);
      if (!userdata)
        return commonErrors(res, 404, {
          error: "Otp has been expaired, please sent verify again  ",
        });
      let parsing = JSON.parse(userdata);
      let existingEmail = await User.findOne({ email: parsing.email });
      if (existingEmail)
        return commonErrors(res, 409, {
          warning: "Your aready registered with this email",
        });
      let createUser = new User({
        username: parsing.username,
        email: parsing.email,
        password: hashingpassword,
      });
      await createUser
        .save()
        .then((res) => {})
        .catch((err) => {
          throw new Error(err.error.message);
        });
      redisDel(email);
      res.status(200).send({
        message: "Welcome to solvusphere, Your registration completed",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = {
        email: email,
        password: password,
      };

      const validating = Validate(
        { email: requirments.email, password: requirments.password },
        userData
      );

      if (!validating.status)
        return commonErrors(res, 400, {
          message: validating.response[0].message,
        });

      let user = await User.findOne({ email: email });
      if (!user)
        return commonErrors(res, 404, {
          message: "User Not Found",
        });

      let isValidPassword = campare(password, email, user.password);
      if (!isValidPassword)
        return commonErrors(res, 400, { message: "Password Doesn't Match" });
      const payload = { _id: user._id, name: user.username, email: user.email };

      let token = Jwt.sign(payload, "#$solvusphere$#");
      return commonErrors(res, 200, {
        message: "Login Successfully",
        token,
        user,
      });
    } catch (error) {
      console.log(error);
      return commonErrors(res, 500, { message: "Internal Server Error" });
    }
  },
};

module.exports = UserController;
