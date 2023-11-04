const User = require("../models/user.model");
const { Validate } = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const UserController = {
  async register(req, res) {
    try {
      const { name, email, number, password } = req.body;
      let userData = {
        username: name,
        email: email,
      };
      let validating = Validate(userData);

      if (!validating.status)
        return res.status(400).send(validating.response[0].message);

      let salt = await bcrypt.genSalt(10);
      let encryptedPassword = await bcrypt.hash(password, salt);
      if (!encryptedPassword)
        return res.status(500).send({ error: "Internal server error" });

      let createUser = new User(userData);
      if (createUser) await createUser.save();

      res.status(200).send("Successfully registered");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error, "Internal Server Error");
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
