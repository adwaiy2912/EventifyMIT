const { sqlDeleteEmailOTP } = require("../models/userDeleteModels");
const { sqlCreateEmailOTP } = require("../models/userCreateModels");
const { sendMail } = require("./sendMail");

const generateOTP = () => {
   try {
      //  Generate a 6 digit OTP
      return Math.floor(100000 + Math.random() * 900000);
   } catch (error) {
      throw error;
   }
};

const sendEmailOTP = async (email, subject, message, duration = 30) => {
   try {
      if (!email || !subject || !message) {
         throw new Error("Email, Subject and Message are required");
      }
      await sqlDeleteEmailOTP(email);

      const otp = generateOTP();

      const mailOptions = {
         from: `"EventifyMIT" <${process.env.SMTP_EMAIL}>`,
         to: email,
         subject,
         html: `<p>${message}</p>
         <p style="color:tomato; font-size: 25px; letter-spacing:2px;">${otp}</p>
         <p> This code <b>expires in ${duration} minutes</b></p>`,
      };
      await sendMail(mailOptions);

      await sqlCreateEmailOTP(email, otp);
   } catch (error) {
      throw error;
   }
};

const sendPhoneOTP = async (phone, message, duration = 30) => {
   try {
      if (!phone || !message) {
         throw new Error("Phone and Message are required");
      }
      //  Delete existing OTP
      await sqlDeletePhoneOTP(phone);

      const otp = generateOTP();

      //  Send OTP to phone
      //  Twilio API or any other service can be used to send OTP to phone
      //  For now, we will just log the OTP
      console.log(otp);

      //  Save OTP to database
      await sqlCreatePhoneOTP(phone, otp);
   } catch (error) {
      throw error;
   }
};

module.exports = { sendEmailOTP, sendPhoneOTP };
