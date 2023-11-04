function DBconnections() {
  const mongoose = require("mongoose");

  mongoose
    .connect("mongodb://0.0.0.0:27017/solution", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
}

module.exports = { DBconnections };

 