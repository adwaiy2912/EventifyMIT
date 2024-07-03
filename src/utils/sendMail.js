const nodemailer = require("nodemailer");

const { SMTP_HOST, SMTP_EMAIL, SMTP_PASS } = process.env;
let transporter = nodemailer.createTransport({
   host: SMTP_HOST,
   auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS,
   },
});

transporter.verify((error) => {
   if (error) {
      console.log(error);
   } else {
      console.log("Server is ready to take messages");
   }
});

const sendMail = async (mailOptions) => {
   try {
      await transporter.sendMail(mailOptions);
   } catch (error) {
      throw error;
   }
};

module.exports = { sendMail };
