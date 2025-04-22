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
      console.log("✉️ Server is ready to take messages");
   }
});

const sendMail = async (mailOptions) => {
   try {
      const info = await transporter.sendMail(mailOptions);

      console.log("Mail sent: %s", info.messageId);
      // For Ethereal accounts only
      const previewURL = require("nodemailer").getTestMessageUrl(info);
      if (previewURL) {
         console.log("Preview URL: %s", previewURL);
      }
   } catch (error) {
      console.error("Error occurred while sending email:", error.message);
      throw error;
   }
};

module.exports = { sendMail };
