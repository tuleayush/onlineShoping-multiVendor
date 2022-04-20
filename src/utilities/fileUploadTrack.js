const FileUpload = require('../models/FileUpload');
const { ImageProviders } = require('./constants/image');

module.exports = {
    async trackUpload(req, res, file, provider = ImageProviders.fileSystem) {
        if (Array.isArray(file))
            await FileUpload.create(file.map(f => {
                return {
                    api: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                    provider,
                    file: f,
                    createdBy: res?.locals?.loggedInUser['_id'] || null,
                    updatedBy: res?.locals?.loggedInUser['_id'] || null
                };
            }));
        else
            await FileUpload.create({
                api: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                provider,
                file,
                createdBy: res?.locals?.loggedInUser['_id'] || null,
                updatedBy: res?.locals?.loggedInUser['_id'] || null
            });
    }
};