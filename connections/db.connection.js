function DBconnections() {
  const mongoose = require("mongoose");
  require("dotenv").config();
  mongoose
    .connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    })
    .then((res) => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
}

process.on("SIGINT", () => {
  mongooseConnection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = { DBconnections };
