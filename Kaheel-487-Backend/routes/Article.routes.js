
    const express = require("express");
    const Article_co = require("../controllers/Article.controller");
    const auth=require('../middleware/auth-check')
    const multerSelector = require("../middleware/multer_selector");
    const router = express.Router();
    router.get("/webSite/:value",(req,res,next)=>{
      Article_co.getArticlesWebSite(req,res,next)
    })
    router.get("/oneClass/:value/:operator",(req,res,next)=>{
      Article_co.getArticleByValue(req,res,next,'ClassId')
    })
    router.post("/test",Article_co.test)
     router.get("", auth, Article_co.getArticles);
 
    
          router.get("/ClassNo/:value/:operator",auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'ClassId');
          });
        
          router.get("/ArticleText/:value/:operator",auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'ArticleText');
          });
        
          router.get("/ArticleDate/:value/:operator", auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'ArticleDate');
          });
        
          router.get("/NoOfDisplay/:value/:operator", auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'NoOfDisplay');
          });
        
          router.get("/NoOfLikes/:value/:operator",auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'NoOfLikes');
          });
        
          router.get("/NoOfDislikes/:value/:operator",auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'NoOfDislikes');
          });
        
          router.get("/NoOfShares/:value/:operator",auth,(req, res, next)=> {
            Article_co.getArticleByValue(req,res,next, 'NoOfShares');
          });
        
    router.post("/", /*multerSelector,*/auth,  Article_co.createArticle);
    router.put("/:id",  /*multerSelector,*/auth ,Article_co.editArticle);
    router.delete("/:id", auth, Article_co.deleteArticle);
    router.put("/addImg/:id",auth,Article_co.addImgArticle)
    module.exports = router;