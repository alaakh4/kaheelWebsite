
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const ObjectID = mongoose.Schema.Types.ObjectId
const moment = require('moment')

const ClassSchema = mongoose.Schema({
  
    ClassId:  {
      type: Number,
      unique:true,
      required: false,
      
       
    }  ,
      

    ClassName:  {
      type: String,
      
      required: false,
      
       
    }  ,
      

  deleted_by_user: { type: Boolean, default: false },
  deleted_by_azdan: { type: Boolean, default: false }
});


ClassSchema.pre('save', function (next) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  next();
});






ClassSchema.post('init', function (doc) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  return this
});

ClassSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Class', ClassSchema);
  