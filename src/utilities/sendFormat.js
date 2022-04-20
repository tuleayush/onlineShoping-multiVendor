const ErrorLog = require('../models/ErrorLog');

module.exports = {
    send: (res,message, data) => {
        return res.status(200).json({ success: true, message, data: data || {} });
    },
    sendFile: (res, filePath, fileName) => {
        return res.sendFile(filePath, fileName);
    },
    sendError: (res, status, message, error) => {
        let now = new Date();
        const sendObj = { success: false, message, error: error || {}, date: new Date(now.getTime() + (330 * 60 * 1000)) };
        ErrorLog.create(sendObj);
        return res.status(status).json(sendObj);
    },
    redirect: (res, message, error) => {
        let now = new Date();
        const sendObj = { success: false, message, error: error || {}, date: new Date(now.getTime() + (330 * 60 * 1000)) };
        ErrorLog.create(sendObj);
        return res.redirect('/');
    }
};