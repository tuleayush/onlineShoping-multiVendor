const fs = require('fs');
const express = require("express");
const router = express.Router();
const resS = require('../utilities/sendFormat');

router.get('/:h1/:h2?/:h3?', (req, res, next) => {
    try {
        console.log('path ',req.params);
        const path = process.env.FOLDER_PATH;
        let file_path = `${path}/${req.params.h1}`;
        if (req.params?.h2) {
            file_path = `${file_path}/${req.params.h2}`;
            if (req.params?.h3) {
                file_path = `${file_path}/${req.params.h3}`;
            }
        }

        if (!fs.existsSync(file_path))
            return resS.sendError(res, 404, "No Such File Found !");
        else if (fs.lstatSync(file_path).isDirectory())
            return resS.sendError(res, 404, "Found Directory Instead of a File !");
        else
            return res.sendFile(file_path);
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;