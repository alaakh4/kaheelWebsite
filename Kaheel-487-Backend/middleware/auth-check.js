const jwt=require('jsonwebtoken')


module.exports=function(req,res,next){
    const token=req.header('auth-token')
   
    if(!token){console.log('Access Denied')
     return res.status(401).send('Access Denied')}

    try{

       const verified= jwt.verify(token,'kaheel7_487')      
       req.user=verified
    }catch(err){
       return res.status(401).json({success:false,msg:'please login again'})
    }
    next()
    
}