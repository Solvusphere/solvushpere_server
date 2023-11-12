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
const { generateAccessToken, generateRefreshToken, reGenerateAccessToken, verify_Token } = require("../../auth/Jwt/jwt.auth");
require('dotenv').config();

const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
};

const UserController = {
  async verify_Email(req, res) {
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
      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let existingEmail = await User.findOne({ email: email });
      if (existingEmail)
        return commonErrors(res, 409, {
          warning: "Your aready registered with this email",
        });

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

      // setup of access token and refresh token
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      let token = {accessToken,refreshToken}

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

  async user_Profile(req,res) {
    try {
      const { accessToken } = req.body;
      let claim = verify_Token(accessToken);
      if (!claim) {
        res.cookie("jwt", "", { maxAge: 0 });
        commonErrors(res,)
      }
      const user = await User.findOne({ _id: claim._id });
      if (!user) return commonErrors(res, 404, { message: "Userdata Not Found!!" });
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },

  async edit_Profile(req, res) {
    try {
      // const id = taking from headers
      const user = await User.findOne({ _id: id })
      if(!user) return commonErrors(res,404,{message:"User Not Found!!"})
      res.status(200).send(user)
      
    } catch (error) {
      console.log(error);
      commonErrors(res,500,{message:"Internal Server Error"})
    }
  },

  async update_Profile(req, res) {
    try {
      
      const { username, number, accessToken } = req.body;
      let claim = verify_Token(accessToken);
      if(!claim) return 
      const user = await User.findOne({})
      if (!user) return commonErrors(res, 404, { message: "User Not Found!!" })
      const update = await User.updateOne({},{$set:{username:username,number:number}})
      if (update.modifiedCount === 0) return commonErrors(res, 403, { message: "Profile Update Failed" })
      return res.status(200).send(user)
    } catch (error) {
       console.log(error);
      commonErrors(res,500,{message:"Internal Server Error"})
    }
  },



  async regenerate_Token(req, res) {
    try {
      const { refreshToken } = req.body;
      let claim = verify_Token(refreshToken);
      const user = await User.findOne({ _id: claim._id });
      if (!user) return commonErrors(res, 404, { message: "User Not Found, Please Login" });
      const payload = { _id: user._id, name: user.username, email: user.email };
      
      // regenerate token
      const token = reGenerateAccessToken(refreshToken, payload);
      if (!token) return commonErrors(res, 403, { message: "some went wrong" });
      return res.status(200).send({ token, message: "Token Regenerated Successfully" });
      
    } catch (error) {
      console.log(error);
      commonErrors(error,500,{message:"Internal Server Error!!"})
    }
  },






  
};

module.exports = UserController;
