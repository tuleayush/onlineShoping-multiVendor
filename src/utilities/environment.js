const environment = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'dev';
module.exports = require('../../config/envConfig')[environment];