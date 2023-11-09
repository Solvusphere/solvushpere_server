const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLEUSER,
    pass: process.env.GOOGLEPASS,
  },
});

function sendEmailAsLink(to) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "adilsha042@gmail.com",
      to: to,
      subject: `One Time OTP for verification `,
      html: ` <div class="container" style="max-width: 800px; margin: 0 auto; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
    <div class="header" style="text-align: center; font-size: 24px; font-weight: bold;">One-Time Password (OTP)</div>
    <div class="logo" style="text-align: center; margin-top: 20px;"><img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.javatpoint.com%2Fcomputer%2Fimages%2Fe-mail.png&tbnid=ArRdipA24dAv2M&vet=12ahUKEwiz_pnnw7GCAxWT2jgGHVzhCyoQMygcegUIARCxAQ..i&imgrefurl=https%3A%2F%2Fwww.javatpoint.com%2Fe-mail&docid=wPpKR7L030rmAM&w=200&h=200&q=mail%20images&ved=2ahUKEwiz_pnnw7GCAxWT2jgGHVzhCyoQMygcegUIARCxAQ" alt="Your Logo" style="max-width: 100%;"></div>
    <div class="description" style="font-size: 18px; margin-top: 20px;">Welcome to our OTP validation service. Please enter the OTP below to continue.</div>
    <div class="otp-container" style="text-align: center; margin: 20px auto;">
      <p>Your OTP is:</p>
     <a href="http://localhost:5173/createpassword" style="font-size: 20px; color: #007bff; font-weight:600;"> <button style="
      height: 30px;
        width: 100px;
        background-color: yellow;
        border-radius: 7px;
        border: solid 0.3px yellow;
        font-weight: 600;" > Click here </button></a>
    </div>
  </div>`,
      replyTo: "adilsha042@gmail.com",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject({ status: false });
      } else {
        console.log(`Email sent successfully!`);
        resolve({ status: true });
      }
    });
  });
}

module.exports = {
  sendEmailAsLink,
};
