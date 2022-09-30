const multer = require('multer')
const MIME_TYPE_MAP = require('../helpers/mime_types')
const moment = require('moment')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mappedExt = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')
    let dest = 'doc'
    if (mappedExt) {
      error = null
    }
    if (
      mappedExt == MIME_TYPE_MAP['image/jpeg'] ||
      mappedExt == MIME_TYPE_MAP['image/jpg'] ||
      mappedExt == MIME_TYPE_MAP['image/png']
    ) {
      dest = 'images'
    }

    cb(error, './public/' + dest)
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype]
    const date = moment().format('MM-DD-YYYY')
    const name = file.originalname.toLowerCase().replace('.' + ext, '') // remove the ext

    cb(null, name + '-' + date + '.' + ext)
  }
})
module.exports = multer({
  storage: storage,
}).single('file');