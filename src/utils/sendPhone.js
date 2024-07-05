const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
   process.env;

const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

sendSMS = async (number, message) => {
   twilio.messages
      .create({
         body: message,
         to: `+91${number}`,
         from: TWILIO_PHONE_NUMBER,
      })
      .catch((error) => console.log(error));
};

module.exports = { sendSMS };
