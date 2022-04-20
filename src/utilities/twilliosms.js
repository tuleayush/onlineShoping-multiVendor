

const { twillio: { sid, authToken } } = require("./environment")
const client = require('twilio')(sid, authToken);

const generateOtp = () => {
  let rand = Math.random() * 10000;
  return ('0000' + rand).slice(-4)
}

const sendSMS = (mobile, message, messagingServiceSid) => {
  mobile = mobile.toString();
  const to = mobile.startsWith('+91') ? mobile : `+91${mobile}`;

  return new Promise((resolve, reject) => {

    client.messages
      .create({
        body: message,
        to,
        messagingServiceSid
      }).
      then((result) => {
        // console.log('>> success', result);
        resolve({ isSuccess: true, response: result ? JSON.stringify(result) : null });
      })
      .catch((err) => {
        // console.log('>> error', err);
        reject({ isSuccess: false, response: err ? JSON.stringify(err) : null });
      });

  });

}

module.exports = { sendSMS, generateOtp };
