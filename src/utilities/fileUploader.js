const multer = require('multer');
const fs = require('fs');
const { ImageProviders } = require('./constants/image');


// const diskStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (!fs.existsSync(process.env.FOLDER_PATH + '/uploads'))
//             fs.mkdirSync(process.env.FOLDER_PATH + '/uploads');
//         if (!fs.existsSync(process.env.FOLDER_PATH + '/uploads/' + file.fieldname))
//             fs.mkdirSync(process.env.FOLDER_PATH + '/uploads/' + file.fieldname);
//         cb(null, process.env.FOLDER_PATH + '/uploads/' + file.fieldname);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }
// });
// module.exports = multer({ storage: diskStorage });


switch (ImageProviders.cloud) {
    case ImageProviders.fileSystem:
        const diskStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                if (!fs.existsSync(process.env.FOLDER_PATH + '/uploads'))
                    fs.mkdirSync(process.env.FOLDER_PATH + '/uploads');
                if (!fs.existsSync(process.env.FOLDER_PATH + '/uploads/' + file.fieldname))
                    fs.mkdirSync(process.env.FOLDER_PATH + '/uploads/' + file.fieldname);
                cb(null, process.env.FOLDER_PATH + '/uploads/' + file.fieldname);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}_${file.originalname}`);
            }
        });

        module.exports = multer({ storage: diskStorage });
        break;
    case ImageProviders.cloud:
        module.exports = require('./fileUploaderS3')?.uploadS3;
        break;
    default:
        module.exports = null;
}


