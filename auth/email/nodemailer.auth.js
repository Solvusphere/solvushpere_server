const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adilsha042@gmail.com",
    pass: "vetqmtwhjfbydacf",
  },
});

function sendEmail(to) {
  return new Promise((resolve, reject) => {
    let OTP = generateOTp();
    const mailOptions = {
      from: "adilsha042@gmail.com",
      to: to,
      subject: `One Time OTP for verification `,
      html: ` <div class="container" style="max-width: 800px; margin: 0 auto; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: left;">
    <div class="header" style="text-align: center; font-size: 24px; font-weight: bold;">One-Time Password (OTP)</div>
    <div class="logo" style="text-align: center; margin-top: 20px;"><img src="" alt="Your Logo" style="max-width: 100%;"></div>
    <div class="description" style="font-size: 18px; margin-top: 20px;">Welcome to our OTP validation service. Please enter the OTP below to continue.</div>
    <div class="otp-container" style="text-align: center; margin: 20px auto;">
      <p>Your OTP is:</p>
      <div id="otp-display" style="font-size: 36px; color: #007bff; font-weight:600;">${OTP}</div>
    </div>
  </div>`,
      replyTo: "adilsha042@gmail.com",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject({ status: false });
      } else {
        console.log(`Email sent successfully!`);
        resolve({ otp: OTP, status: true });
      }
    });
  });
}
function generateOTp() {
  let sixdegiNumebr = Math.floor(Math.random() * 900000 + 100000);
  return sixdegiNumebr;
}

module.exports = {
  sendEmail,
};
