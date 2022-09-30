
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const ObjectID = mongoose.Schema.Types.ObjectId
const moment = require('moment')

const SettingSchema = mongoose.Schema({
  
    SettingName:  {
      type: String,
      
      required: [true, null],
      
       
    }  ,
      

    SettingValue:  {
      type: String,
      
      required: false,
      
       
    }  ,
      

  deleted_by_user: { type: Boolean, default: false },
  deleted_by_azdan: { type: Boolean, default: false }
});


SettingSchema.pre('save', function (next) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  next();
});






SettingSchema.post('init', function (doc) {
  for (let key in this._doc) {
    if (!!this._doc[key].toString().match(/([A-Za-z]){3}( )([A-Za-z]){3}( )(\d){2}( )(\d){4}/g)) {
      this._doc[key] = moment(Number(this._doc[key])).format('MM-DD-YYYY');
    }
  }
  return this
});

SettingSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Setting', SettingSchema);
  