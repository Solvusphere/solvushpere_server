const User = require("../models/user.model");
const { Validate } = require("../validations/user.validation");

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
};

module.exports = UserController;
