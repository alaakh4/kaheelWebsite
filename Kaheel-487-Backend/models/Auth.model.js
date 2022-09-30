const mongoose=require('mongoose')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const userSchema=mongoose.Schema({
    name: {
        type:String,
        min:15,
        max:255,
        
    },
    email:{  
        type:String,
        min:15,
        max:255,
       
    },
    password:{
        type:String,
        min:6,
        max:1024,
    
    },
    Date:{
        type:Date,
        default:Date.now,
        
},
resetPasswordToken: {
    type: String,
    required: false
},

resetPasswordExpires: {
    type: Date,
    required: false
},
deleted_by_user: { type: Boolean, default: false },
deleted_by_azdan: { type: Boolean, default: false }

})


userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        name: this.name,
        
    };

    return jwt.sign(payload, process.env.JWT_SALT, {
        expiresIn: '1h'
    });
};

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
module.exports=mongoose.model('User',userSchema);
