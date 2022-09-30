const JsonWebToken=require('jsonwebtoken')
class token{
   static createToken(tokenData){
        return new Promise((resolve,reject)=>{
            const jwt = JsonWebToken.sign(tokenData,process.env.JWT_SALT,{
                expiresIn:'1h'
            })
            return resolve(jwt)
        .catch(err=>{
            return reject(err)
            })
        })
    }
}
module.exports = token