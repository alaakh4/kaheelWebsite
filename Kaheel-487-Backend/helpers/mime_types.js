const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
    'dotx',
  'application/vnd.ms-word.document.macroEnabled.12': 'docm',
  'application/vnd.ms-word.template.macroEnabled.12': 'dotm',
  'application/vnd.ms-excel': 'xla',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
    'xltx',
  'application/vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
  'application/vnd.ms-excel.template.macroEnabled.12': 'xltm',
  'application/vnd.ms-excel.addin.macroEnabled.12': 'xlam',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'xlsb',
  'application/vnd.ms-powerpoint': 'ppa',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'application/vnd.openxmlformats-officedocument.presentationml.template':
    'potx',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
    'ppsx',
  'application/vnd.ms-powerpoint.addin.macroEnabled.12': 'ppam',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'pptm',
  'application/vnd.ms-powerpoint.template.macroEnabled.12': 'potm',
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'ppsm',

  'application/pdf': 'pdf'
}

module.exports = MIME_TYPE_MAP