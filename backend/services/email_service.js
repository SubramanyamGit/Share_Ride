const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "subbu6144@gmail.com",
    pass: "oebk lfcr amhq idww",
  },
});

const sendMail = (mailOptions) => {
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

// const mailOptions = {
//   from: 'subbu6144@gmail.com',
//   to: 'subramanyamsiliveri@gmail.com',
//   subject: 'Hello from Node.js',
//   text: 'This is a test email sent using Nodemailer.',
//   html: '<b>This is a test email sent using Nodemailer.</b>',
// };
module.exports = sendMail;