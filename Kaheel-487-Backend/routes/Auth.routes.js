const express=require('express')
const router=express.Router()
const User=require('../models/Auth.model')
const bycrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Auth_co=require('../controllers/user.controller')
router.post('/login',Auth_co.loginAuth)
router.post('/forgetPass',Auth_co.forgetPass)
router.post('/checkUrl/:resettoken',Auth_co.checkUrl)
router.post('/ResetPass/:id',Auth_co.ValidPasswordToken)
//router.post('/signUp',Auth_co.addAuth)
//router.get('',Auth_co.getAuths)
//router.delete('/delete/:id',Auth_co.deleteAuth)
//router.put('/update/:id',Auth_co.editAuth)

// LOGIN
/*router.post('/login',async (req,res)=>{
   
  //Check the Email
  const user=await User.findOne({email:req.body.email})
  if(!user) return res.status(400).send('email or password wrong!')
  //Check the password
  const vaildPass=await bycrypt.compare(req.body.password,user.password)
  if(!vaildPass) return res.status(400).send('email or password wrong!')
 const token= jwt.sign({user:user._id},process.env.JWT_SALT)
  res.header('auth-token',token).send(token)
})*/
module.exports = router;
    