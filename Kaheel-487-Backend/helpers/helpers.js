module.exports = class {
    // generate json object 
    static res_obj(success, data_or_error, message) {
        //console.log(message)
        return {
            success,
            data:data_or_error,
            message
            }
    }
}