
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const ObjectID = mongoose.Schema.Types.ObjectId
const moment = require('moment')
const Class = require('./Class.model.js')

const ArticleSchema = mongoose.Schema({

  ClassId: {
    type: Number,
    required: true
  },
  ArticleName: {
    type: String,
    required: [false, null]
  },
  video: {
    type: String,
    required: [false, null]
  },
  ArticleText: {
    type: String,
    required: [false, null],
  },
  ArticleDate: {
    type: String,
    unique: false,
    required: [true, null],
  },
  NoOfDisplay: {
    type: Number,
    required: [true, null],
    default: 0
  },
  NoOfLikes: {
    type: Number,
    required: false,
    default: 0
  },
  NoOfDislikes: {
    type: Number,
    required: false,
    default: 0
  },
  NoOfShares: {
    type: Number,
    required: [true, null],
    default: 0
  },
  References: {
    type: String,
    require: [false]
  },
  ArticleDesc: {
    type: String,
    required: [false]
  },
  MediaType: {
    type: String,
    enum: ['img','video','noMedia'],
    required: [true]
    },
  deleted_by_user: { type: Boolean, default: false },
  deleted_by_azdan: { type: Boolean, default: false }
  
});
ArticleSchema.pre('save', function (next) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  next();
});



ArticleSchema.post('validate', async function (res, next) {
  let ClassLength = await (Class.find({ ClassId: this.ClassNo }, {}, { autopopulate: false })).length
  if (ClassLength === 1) {
    console.log("--------------------");
    console.log(res);
    next();
  } else {
    console.log(res);
    return res
  }
});




ArticleSchema.post('init', function (doc) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  return this
});

ArticleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Article', ArticleSchema);
