
const helpers = require('../helpers/helpers')
module.exports = class validation {

    //check if array field is empty or not
    static required_arr(req, res, field) {
        //  check for the existance of the field or check if its type is array or not  
        if ((Array.isArray(field) && req.body[field].length == 0) || !req.body[field]) {
            res.json(
                helpers.res_obj(
                    false,
                    { msg: `required field '${field}' is missing` }
                )
            )
        }
    }
    
     // validate if the given status is in the valid range of manual array or not
     static validate_status(req,res,arr,manual_change_length = arr.length){
        if(req.params.status > arr.length-1){
            res.json(
                helpers.res_obj(
                    false,//success
                    {msg : "This status doesn't exist - out of range status"}//error
                    )
            )
        }
        else if(req.params.status >= manual_change_length){
            res.json(
                helpers.res_obj(
                    false,//success
                    {msg : 'Invalid status ..'}//error
                    )
            )
        }
    }
}