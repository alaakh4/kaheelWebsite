
    const express = require("express");
    const Setting_co = require("../controllers/Setting.controller");
   // const authenticate = require("../middleware/check-auth")
    const multerSelector = require("../middleware/multer_selector");
    const router = express.Router();
    
     router.get("", /*authenticate,*/Setting_co.getSettings); 
    
          router.get("/SettingName/:value/:operator", /*authenticate,*/(req, res, next)=> {
            Setting_co.getSettingByValue(req,res,next, 'SettingName');
          });
        
          router.get("/SettingValue/:value/:operator",/* authenticate,*/(req, res, next)=> {
            Setting_co.getSettingByValue(req,res,next, 'SettingValue');
          });
        
    router.post("/", /*multerSelector,  /*authenticate,*/Setting_co.createSetting);
    router.put("/:id",  /*multerSelector,  authenticate,*/Setting_co.editSetting);
    router.delete("/:id", /* authenticate,*/Setting_co.deleteSetting);
    
    module.exports = router;
    