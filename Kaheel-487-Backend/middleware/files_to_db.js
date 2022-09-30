const multer = require('multer')


module.exports = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000 * 1000 * 12
    },
}).single('image_data');