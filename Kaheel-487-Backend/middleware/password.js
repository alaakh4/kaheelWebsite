const bcrypt = require('bcryptjs')
class password{
    static comparePassword(pass,pass2Compare){
        return new Promise((resolve,reject)=>{
            bcrypt
            .compare(pass,pass2Compare)
            .then(result=>{
                if(result == false){
                    return reject('password or email wrong')
                }
                return resolve();
            })
            .catch(err=>{
                return reject(err)
            })
        })
    }
    static hashPass(newPass){
        return new Promise((resolve,reject)=>{
            bcrypt
            .hash(newPass,10)
            .then(response=>{
                return resolve(response)
            })
            .catch(err=>{
                return reject(err)
            })
        })
    }
}
module.exports = password