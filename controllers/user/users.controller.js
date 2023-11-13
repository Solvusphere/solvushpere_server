const {
  redisGet,
  redisDel,
  redisSet,
  setObjectWithExp,
} = require("../../connections/redis.connection");
const User = require("../../models/users.model");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
const { Validate } = require("../../validations/user.validation");
const { hashPassword, campare } = require("../../utils/bcrypt");
const { commonErrors } = require("../../middlewares/error/commen.error");
const { sendEmailAsLink } = require("../../auth/email/link.auth");

const { generateAccessToken, generateRefreshToken, reGenerateAccessToken, verify_Token } = require("../../auth/Jwt/jwt.auth");
const { use } = require("../../routers/admin.router");
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
        setObjectWithExp(userdata);
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
      let userdata = await redisGet(`${email}_verify`);
      if (!userdata)
        return commonErrors(res, 404, {
          error: "Your email isn't verified, please sent verification mail  ",
        });
      let parsing = JSON.parse(userdata);
      let existingEmail = await User.findOne({ email: parsing.email });
      if (existingEmail)
        return commonErrors(res, 409, {
          warning: "Your already registered with this email",
        });
      let createUser = new User({
        username: parsing.username,
        email: parsing.email,
        password: hashingpassword,
        registered:true
      });
      await createUser
        .save()
        .then((res) => {
          redisSet(`str_user${res._id}`, JSON.stringify(res));
        })
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
      console.log(req.body);
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
      redisSet(`str_user${user._id}`, JSON.stringify(user));
      let retrinve = await redisGet(`str_user${user._id}`);
      console.log(JSON.parse(retrinve));
      let isValidPassword = campare(password, email, user.password);
      if (!isValidPassword)
        return commonErrors(res, 400, { message: "Password Doesn't Match" });
      user = await User.findByIdAndUpdate(user._id, { active: true }, { new: true }).select("-password")
      const payload = { _id: user._id, name: user.username, email: user.email };

      // setup of access token and refresh token
      const accessToken = generateAccessToken(payload,res);
      const refreshToken = generateRefreshToken(res);
      let token = { accessToken, refreshToken }
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
      const { accessToken } = req.query;
      const { _id } = req.user

      const user = await redisGet(`str_user${_id}`)
       if(!user)
          return commonErrors(res, 404, { message: "Userdata Not Found!!" });
        
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },

  async edit_Profile(req, res) {
    try {
      const { accessToken } = req.body;

      const claim = await verify_Token(accessToken)
        .catch((error) => {
          res.cookie("jwt", "", { maxAge: 0 });
          return commonErrors(error, 403, { message: "Session Expired" });
        });
      
      const user = await redisGet(`${claim._id}`)
      if (!user)
        return commonErrors(res, 404, { message: "User Not Found!!" });

      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      commonErrors(res, 500, { message: "Internal Server Error" });
    }
  },

  async update_Profile(req, res) {
    try {
      const { username, number, accessToken } = req.body;

      let claim = await verify_Token(accessToken)
        .catch((error) => {
          res.cookie("jwt", "", { maxAge: 0 });
          return commonErrors(error, 403, { message: "Session Expired" });
        });

      const user = await redisGet(`${claim._id}`)
      if (!user)
        return commonErrors(res, 404, { message: "User Not Found!!" });

       await User.findByIdAndUpdate({ _id: user._id },
        { username: username, number: number }, { new: true })
        .then((res) => {
          redisSet(`str_user${res._id}`, JSON.stringify(res));
        }).catch((error) => {
          return commonErrors(error, 403, { message: "Profile Update Failed" });
        });
      
      return res.status(200).send(user);
    } catch (error) {
       console.log(error);
      commonErrors(res, 500, { message: "Internal Server Error" });
    }
  },

  async changePassword(req, res) {
    try {
      const { accessToken, newPassword, oldPassword } = req.body;

      let claim = await verify_Token(accessToken)
        .catch((error) => {
          res.cookie("jwt", "", { maxAge: 0 });
          return commonErrors(error, 403, { message: "Session Expired" });
        });

      const user = await redisGet(`str_user${claim._id}`)
        .catch((error) => {
         
        })
      
      await campare(oldPassword, user.password)
        .catch((error) => {
          return commonErrors(res, 403, { message: "Old Password Doesn't Match" });
        });

      let hashingpassword = hashPassword(newPassword, user.email)
        .catch((error) => {
          return commonErrors(res, 403, { message: "Password Hashing Failed" })
        })
      
      await User.findByIdAndUpdate(user._id, { password: hashingpassword }, { new: true })
        .then((res) => {
            console.log('Updated user:', updatedUser);
          redisSet(`str_user:${updatedUser._id}`, JSON.stringify(res))
          res.status(200).send({message:"Password Updated Successfully"},res)
        }).catch((error) => {
            console.error('Error updating user:', error);
            commonErrors(error, 403, { message: 'Error updating user:', error });
        })
      
    } catch (error) {
      console.log(error);
      commonErrors(error,500,{message:"Internal Server Error"})
    }
  },

  async forgotPassword(req, res) {
  try {
    
  } catch (error) {
    console.log(error);
    commonErrors(error,500,{message:"Internal Server Error!!"})
  }
  }
  ,



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
      commonErrors(error, 500, { message: "Internal Server Error!!" });
    }
  },

};

module.exports = UserController;
