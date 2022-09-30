
exports
module.exports = class Setters{
    constructor(){
    }

    // set doc status after validate it

    static set_doc_status(req,res,arr){
        req.body.doc_status = [{ "status":arr[req.params.status], "user_id":req.user_data._id, "date":new Date() }];
    }

    static update_doc_status(req,res,arr){
        return  {"status":arr[req.params.status],"user_id":req.user_data._id,"date":new Date()};
    }

    // update signature
    static update_signature(req,res){
        req.body.updated_by = req.user_data._id
        req.body.update_date = new Date()
    }

    // creation signature
    static creation_signature(req,res){
        req.body.created_by = req.user_data._id
        req.body.creation_date = new Date()

    }
}




