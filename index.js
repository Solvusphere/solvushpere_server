const express = require("express");
const { DBconnections } = require("./connections/db.connection");
const user = require("./routers/user.router");
const morgan = require("morgan");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

// databse connection
DBconnections();

app.use("/user", user);
app.listen(3000, () => console.log("connected"));

module.exports = app;
