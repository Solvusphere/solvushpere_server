const express = require("express");
const { DBconnections } = require("./connections/db.connection");
const user = require("./routers/users.router");
const company = require("./routers/company.router")
const morgan = require("morgan");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(morgan("dev"));

// databse connection
DBconnections();
// database connection end


// <------------------routes-------------------->
app.use("/user", user);
app.use('/company', company);
// <-------------------------------------------->


app.listen(process.env.PORT || 3000, () => console.log("connected"));

module.exports = app;
