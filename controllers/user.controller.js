const User = require("../models/user.model");
const { Validate,LoginValidate } = require("../validations/user.validation");
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

const UserController = {
  async register(req, res) {
    try {
      const { name, email, number, password } = req.body;
      let userData = {
        username: name,
        email: email,
        password: password,
        number: number,
      };
   
      let validating = Validate(userData);

      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let createUser = new User(userData);
      if (createUser) await createUser.save();

      res.status(200).send("Successfully registered");
    } catch (error) {
      console.log(error);

      return res.status(500).send(error, "Internal Server Error");
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
    
    let token = Jwt.sign({ _id: user._id }, "secret");
    return res.status(200).send("Login Successfully",token,user)
    
  } catch (error) {
    console.log(error);
  }
  }

 
};

module.exports = UserController;
