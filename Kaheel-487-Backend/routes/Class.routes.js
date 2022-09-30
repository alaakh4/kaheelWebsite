
    const express = require("express");
    const Class_co = require("../controllers/Class.controller");
   // const authenticate = require("../middleware/check-auth")
    const multerSelector = require("../middleware/multer_selector");
    const router = express.Router();
    const auth=require('../middleware/auth-check')
    router.get("/webSite" , Class_co.getClassWebSite); 
    router.put("/addImg/:id",auth,Class_co.addImgArticle)
     router.get("",auth , Class_co.getClasss); 
    
          router.get("/ClassId/:value/:operator",/* authenticate,*/(req, res, next)=> {
            Class_co.getClassByValue(req,res,next, 'ClassId');
          });
        
          router.get("/ClassName/:value/:operator",/* authenticate,*/(req, res, next)=> {
            Class_co.getClassByValue(req,res,next, 'ClassName');
          });
        
    router.post("/", /*multerSelector,*/  auth,Class_co.createClass);
    router.put("/:id",  /*multerSelector, */ auth,Class_co.editClass);
    router.delete("/:id", auth ,Class_co.deleteClass);
    
    module.exports = router;
    