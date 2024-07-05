const {
   sqlDeleteEmailOTP,
   sqlDeletePhoneOTP,
} = require("../models/userDeleteModels");
const {
   sqlCreateEmailOTP,
   sqlCreatePhoneOTP,
} = require("../models/userCreateModels");
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

const sendPhoneOTP = async (phone, duration = 30) => {
   try {
      if (!phone) {
         throw new Error("Phone is required");
      }
      await sqlDeletePhoneOTP(phone);

      const otp = generateOTP();
      const message = `${otp} is your EventifyMIT verification code. This code expires in ${duration} minutes.`;

      await sendSMS(phone, message);

      await sqlCreatePhoneOTP(phone, otp);
   } catch (error) {
      throw error;
   }
};

module.exports = { sendEmailOTP, sendPhoneOTP };
