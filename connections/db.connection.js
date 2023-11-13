function DBconnections() {
  const mongoose = require("mongoose");
  require("dotenv").config();

  const db = mongoose.connection;

  db.on("connecting", () => {
    console.log("Connecting to MongoDB...");
  });

  db.on("error", (err) => {
    console.error("Error in MongoDB connection:", err);
    mongoose.disconnect();
  });

  db.on("connected", () => {
    console.log("Connected to MongoDB!");
  });

  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB. Reconnecting...");
    mongoose.connect(process.env.MONGO_CONNECTION, {
      /* options */
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
  });
  mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
  });
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
