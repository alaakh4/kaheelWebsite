
  const CRUD = require('../helpers/crud')
  const helpers = require('../helpers/helpers')
  
    
    exports.getSettings = (req, res) => {
      CRUD.get_data('Setting', {}, {}, [], false)
        .then(async response => {
         
         if(response.data.data[0].subType !== undefined && response.data.data[0].subType.length > 0) {
            let sub = {};
            let supers = response.data.data;
            for (let document of supers) {
              let mysub = await CRUD.get_one_data(document._doc.subType, { SettingId:document._doc._id })
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
    
    
    
    exports.createSetting = (req, res, next) => {
      CRUD.create(req.body, 'Setting')
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }
    
    
    exports.editSetting = (req, res, next) => {
      const update = {
        $set: req.body
      }
    
      CRUD.update_one(
        'Setting',
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

    
    
    exports.getSettingByValue = (req, res, next, filter) => {
      opr = '$' + req.params.operator
      const filterValue = req.params.value
    
      CRUD.get_data(
        'Setting',
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
    
  
    
    exports.deleteSetting = (req, res, next) => {
      CRUD.delete('Setting', {
        _id: req.params.id
      })
        .then(response => {
          res.status(201).send(response)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    }

    
    

    