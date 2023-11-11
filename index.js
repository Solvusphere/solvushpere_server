const express = require("express");
const { DBconnections } = require("./connections/db.connection");
const user = require("./routers/users.router");
const admin = require("./routers/admin.router");
const company = require("./routers/company.router");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PUT","PACTH"],
    credentials: true,
  })
);

/* <-----------------   setup bodyparse  --------------> */
app.use(express.json());
/* <-----------------  end setup bodyparse  --------------> */

/* <-----------------   setup morgon  --------------> */
app.use(morgan("dev"));
/* <-----------------   end setup morgon  --------------> */

/* <-----------------   databse connection --------------> */
DBconnections();
//* <-----------------   database connection end  -------------> */

/* <------------ Start Rate Limit on server --------------> */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

app.use(limiter);
/* <------------ End Rate Limit on server  -------------> */

// <------------------routes-------------------->
app.use("/", user);
app.use("/company", company);
app.use("/admin", admin);
// <-------------------------------------->

app.listen(process.env.PORT || 3000, () => console.log("connected"));

module.exports = app;
