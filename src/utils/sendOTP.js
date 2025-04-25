const bcrypt = require("bcrypt");
const { OTP } = require("../models/index");

const { sendMail } = require("./sendMail");
const { sendSMS } = require("./sendPhone");

const generateOTP = () => {
   try {
      //  Generate a 6 digit OTP
      return Math.floor(100000 + Math.random() * 900000);
   } catch (error) {
      throw error;
   }
};

const sendEmailOTP = async (email, duration = 30) => {
   try {
      if (!email) {
         throw new Error("Email, Subject and Message are required");
      }
      await OTP.destroy({ where: { email } }); // Deletes old OTP

      const otp = generateOTP();

      const mailOptions = {
         from: `"EventifyMIT" <${process.env.SMTP_EMAIL}>`,
         to: email,
         subject: "EventifyMIT Email Verification",
         html: `<p>Verify your email with the code below.</p>
         <p style="color:tomato; font-size: 25px; letter-spacing:2px;">${otp}</p>
         <p> This code <b>expires in ${duration} minutes</b></p>`,
      };
      await sendMail(mailOptions);

      const hashedOTP = await bcrypt.hash(otp.toString(), 10);
      await OTP.create({ email, otp_code: hashedOTP });
   } catch (error) {
      throw error;
   }
};

const sendPhoneOTP = async (phone, duration = 30) => {
   try {
      if (!phone) {
         throw new Error("Phone is required");
      }
      await OTP.destroy({ where: { phone } }); // Deletes old OTP

      const otp = generateOTP();
      const message = `${otp} is your EventifyMIT verification code. This code expires in ${duration} minutes.`;

      await sendSMS(phone, message);

      const hashedOTP = await bcrypt.hash(otp.toString(), 10);
      await OTP.create({ phone, otp_code: hashedOTP });
   } catch (error) {
      throw error;
   }
};

module.exports = { sendEmailOTP, sendPhoneOTP };
