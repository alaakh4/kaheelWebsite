  const CRUD = require('../helpers/crud')
  const helpers = require('../helpers/helpers')
  
    
    exports.getClasss = (req, res) => {
      CRUD.get_data('Class', {}, {}, [], false)
        .then(async response => {
         
         if(response.data.data[0].subType !== undefined && response.data.data[0].subType.length > 0) {
            let sub = {};
            let supers = response.data.data;
            for (let document of supers) {
              let mysub = await CRUD.get_one_data(document._doc.subType, { ClassId:document._doc._id })
              sub = mysub.data.data
            }
            const revambedData = supers.map(su => {
              return { ...su._doc, [su._doc.subType]: sub._doc }
            })
      
            return res.status(201).send({ data: { data: revambedData } })
         }
       
        res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }
    
    
    
    exports.createClass = (req, res, next) => {
      CRUD.create(req.body, 'Class')
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }
    
    
    exports.editClass = (req, res, next) => {
      const update = {
        $set: req.body
      }
    
      CRUD.update_one(
        'Class',
        {
          _id: req.params.id
        },
        update
      )
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }

    
    
    exports.getClassByValue = (req, res, next, filter) => {
      opr = '$' + req.params.operator
      const filterValue = req.params.value
    
      CRUD.get_data(
        'Class',
        {
          [filter]: {
            [opr]: filterValue
          }
        }
      )
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }
    


    exports.deleteClass = (req, res, next) => {
      CRUD.delete('Class', {
        _id: req.params.id
      })
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }


    
    exports.getClassWebSite=(req,res)=>{
      let classes={$and:[{'ClassId':{$ne:1}},{'ClassId':{$ne:2}}]}
      CRUD.get_data('Class', classes)
      .then(async response => {
         
        if(response.data.data[0].subType !== undefined && response.data.data[0].subType.length > 0) {
           let sub = {};
           let supers = response.data.data;
           for (let document of supers) {
             let mysub = await CRUD.get_one_data(document._doc.subType, { ClassId:document._doc._id })
             sub = mysub.data.data
           }
           const revambedData = supers.map(su => {
             return { ...su._doc, [su._doc.subType]: sub._doc }
           })
     
           return res.status(201).send({ data: { data: revambedData } })
        }
      
       res.status(201).send(response)
       })
       .catch(err => {
         res.status(400).send(err)
       })
    }

    exports.addImgArticle=(req,res)=>{
      if(req.files!=0){
        req.files.imageFile.mv('upload/'+req.params.id+'.jpg',(err)=>{
           if(err) return res.status(404).send(err)
           res.send('done') 
        })}
        console.log("req.files.imageFile.data")
}

    
    

    