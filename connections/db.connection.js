function DBconnections() {
  const mongoose = require("mongoose");
  require('dotenv').config()
  mongoose
    .connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
}

module.exports = { DBconnections };
