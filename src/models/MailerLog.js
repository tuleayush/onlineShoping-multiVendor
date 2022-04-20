const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailerLogSchema = new Schema({
  subject: { type: String, default: null },
  body: { type: String, default: null },
  to: { type: [String], default: [] },
  cc: { type: [String], default: [] },
  bcc: { type: [String], default: [] },
  attachments: { type: [String], default: [] },
  error: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model('mailerlog', MailerLogSchema);