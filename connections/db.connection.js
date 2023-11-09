function DBconnections() {
  const mongoose = require("mongoose");

  mongoose
    .connect(
      "mongodb+srv://Solvusphere:4GCr2kfGY6kJa3bT@cluster0.eewbchx.mongodb.net/solvusphere",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((res) => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
}

module.exports = { DBconnections };
