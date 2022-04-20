const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SmsLogSchema = new Schema({
  message: { type: String, required: true },
  to: { type: String, required: true, index: true },
  isSuccess: { type: Boolean, required: true, default: true },
  provider: { type: String, default: 'twilio' },
  messageServiceName: { type: String, default: null },
  response: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

module.exports = mongoose.model('smsLogs', SmsLogSchema);