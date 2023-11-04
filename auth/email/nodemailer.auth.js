const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adilsha042@gmail.com",
    pass: "vetqmtwhjfbydacf",
  },
});

const FireNow = () => {
  let campanies = [
    {
      Cmail: "ta@buzzboard.com",
      Cname: "BuzzBoard",
      titel: "Application for Node.js developer",
    },
    // {
    //   Cmail: "absrreddy@gmail.com",
    //   Cname: "LoveCo",
    //   titel: "Application for Node.js developer",
    // },
  ];

  for (let i = 0; i < campanies.length; i++) {
    sendEmail(campanies[i]);
  }
};

function sendEmail(to) {
  const mailOptions = {
    from: "adilsha042@gmail.com",
    to: `${to.Cmail}`,
    subject: `${to.titel}`,
    html: manipulateContent({ Cname: `${to.Cname}` }),
    attachments: [
      {
        filename: "Adilsha Resume.pdf", // Desired name of the attachment
        path: path.join(__dirname, "Adilsha.pdf"), // Replace with the path to your PDF file
      },
    ],
    replyTo: "adilsha042@gmail.com",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent successfully! ${to.Cmail}`);
    }
  });
}

FireNow();
