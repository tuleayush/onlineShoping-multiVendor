"use strict";

const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const MailerLog = require("../../models/MailerLog");
const {
  mailer: { email, password },
} = require("../environment")

const mailOptions = {
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: password,
  },
};

const transporter = nodemailer.createTransport(mailOptions);

module.exports = {
  sendEmail: async (to,subject, payload, template) => {
      try{

      console.log("SENDING MAIL >>>");
      const source = fs.readFileSync(path.join(__dirname, template), {encoding:'utf8', flag:'r'});
      const compiledTemplate = handlebars.compile(source);

      const options = () => {
        return {
          from: process.env.FROM_EMAIL,
          to,
          subject: subject,
          html: compiledTemplate(payload),
        };
      };

      console.log(options(),'Mail Data')

      // Send email
      transporter.sendMail(options(), (error, info) => {
        if (error) {
          return error;
        } else {
          return res.status(200).json({
            success: true,
          });
        }
      })
    } catch (error) {
      await MailerLog.create({
        subject,
        to,
        error,
      });
      return error;
    }
}
}
