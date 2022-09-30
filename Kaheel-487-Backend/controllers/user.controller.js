const CRUD=require('../helpers/CRUD')
const AuthSchema=require('../models/Auth.model')
const bcrypt = require('../middleware/password')
const jwt=require('../middleware/Auth')
const nodemailer =require('nodemailer')
/*exports.getAuths=(req,res)=>{
    CRUD.get_data('Auth',{},{},[],false)
    .then(async response => {
         
        if(response.data.data[0].subType !== undefined && response.data.data[0].subType.length > 0) {
           let sub = {};
           let supers = response.data.data;
           for (let document of supers) {
             let mysub = await CRUD.get_one_data(document._doc.subType, { AuthId:document._doc._id })
             sub = mysub.data.data
           }
           const revambedData = supers.map(su => {
             return { ...su._doc, [su._doc.subType]: sub._doc }
           })
     
           return res.status(201).send({ data: { data: revambedData } })
        }
      
       res.status(201).send(response)
       })
       .catch(err => {
         res.status(400).send(err)
       })
}*/

/*exports.addAuth=(req,res,next)=>{
    CRUD.create(req.body,'Auth')
    .then(response=>{
        res.status(201).json({'Your ID':response.data._id})
    }
    
    ).catch(err=>{
        res.status(400).send(err)
    })
}*/

/*exports.deleteAuth=(req,res,next)=>{
    CRUD.delete('Auth',{
        _id:req.params.id})
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
}*/
/*exports.editAuth=(req,res,next)=>{
    CRUD.update_one('Auth',{_id:req.params.id},req.body)
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
}*/
exports.loginAuth=async(req,res,next)=>{
  //Check the Email
  AuthSchema.findOne({email:req.body.email})
  .then(response=>{
    if(!response) return res.status(401).json({success:false, msg:'email or password wrong'})
    //Check the password
    bcrypt.comparePassword(req.body.password,response.password)
    .then(result=>{
      jwt.createToken({userName:response.name,email:response.email})
      .then(token=>{
        res.status(200).send({success:true,msg:'login successfully',token:token})
      })// end send token
      .catch(err=>{
        res.status(500).json({success:false,msg:'error while create token'})
      })// end error token  
    }// end password true
    ,wrong=>{
      return res.status(401).json({success:false, msg:'email or password wrong'})
    }// end password wrong
    )// end hash password
    .catch(err=>{
      res.status(500).json({success:false,msg:'error while hash password'})
    })// end hashpassword error
  })// end findOne

}


exports.findUser=async (req,res)=>{
    const check=await AuthSchema.findOne({email:req.body.email})
    if(!check) return res.status(409).send('email does not exists')
    res.status(201).send(check) 
   }


   
  
   
   // ===PASSWORD RECOVER AND RESET
   
   // @route POST api/auth/recover
   // @desc Recover Password - Generates token and Sends password reset email
   // @access Public
   exports.forgetPass = (req, res) => {
             let user=AuthSchema.findOne({email: req.body.email})
           .then(user => {
               if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
   
               //Generate and set password reset token
               user.generatePasswordReset();
          
               // Save the updated user object
               user.save()
                .then(response =>{
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        port: 299,
                        auth: {
                          user: 'alkaheel12345678@gmail.com',
                          pass: 'Alaa1234567A'
                        }
                      });
                      var mailOptions = {
                      to: user.email,
                      from: 'alkaheel12345678@gmail.com',
                      subject: 'Node.js Password Reset',
                      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://127.0.0.1:5501/resetPass.html?id='+ user.resetPasswordToken  + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                      }
                      transporter.sendMail(mailOptions, (err, info) => {
                          if(err) return res.send(err.stack)
                          res.send(info)
                      })
                })
           })
           .catch(err => res.status(500).json({message: err.message}));
          
          
   };
      // @route POST api/ResetPass
   // @desc check URL
   // @access Public
   exports.checkUrl=async(req, res)=> {
    if (!req.params.resettoken) {
    return res
    .status(500)
    .json({ message: 'Token is required' });
    }
    const user = await AuthSchema.findOne({
        resetPasswordToken: req.params.resettoken
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Invalid URL' });
    }
    AuthSchema.findOne({ _id: user._userId }).then(() => {
    res.send('done')
    }).catch((err) => {
    return res.status(500).send({ msg: err.message });
    
    });
   
  
}
exports.ValidPasswordToken=(req,res)=>{
AuthSchema.findOne({ resetPasswordToken: req.params.id })
   .then (userToken=>{
    if (!userToken) {
      return res
        .status(409)
        .json({ message: 'Token has expired' });
    }
    AuthSchema.findOne({
      _id: userToken._id
    })
    .then(userEmail =>{
      if (!userEmail) {
        return res
          .status(401)
          .json({ success:false,message: 'User does not exist' });
      }
      return bcrypt.hashPass(req.body.newPassword)
      .then(newHashPass=>{
        userEmail.password = newHashPass;
        userEmail.resetPasswordToken=undefined;
        userEmail.resetPasswordExpires=undefined
        userEmail.save()
        .then(response=>{
          return res
          .status(201)
          .json({ success:true,message: 'Password reset successfully' });
        })
        .catch(err=>{
          return res
          .status(400)
          .json({ success:false,message: 'Password can not reset.' });
        })// end of save
      })// end of hash new pass
    })// end of find user
  });// end of find reset token
};