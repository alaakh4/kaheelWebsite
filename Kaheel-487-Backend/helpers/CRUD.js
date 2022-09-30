const Schemas = {
  Class: require('../models/Class.model'),
  Article: require('../models/Article.model'),
  Setting: require('../models/Setting.model'),
  Auth: require('../models/Auth.model')
}
const helpers = require('./helpers')
const bycrypt = require('bcryptjs')

class CRUD {
  constructor() { }
  // Create
  static create(body, schemaName, respond = true) {
    return new Promise(async (resolve, reject) => {
      let _schema = new Schemas[schemaName](body)

      _schema
        .save()
        .then((data) => {
          resolve(this.Callback(true, data, respond, 'Added Successfully'))
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }
  static get_Article_webSite(count, schemaName, where = {}, display = {}, cols = [], autopopulate = false) {
    return new Promise((resolve, reject) => {
      var date = new Date()
      var now = (date.getUTCFullYear() + "-" +
        (date.getUTCMonth() + 1).toString().padStart(2, 0) + "-" +
        date.getUTCDate().toString().padStart(2, 0) + "T" +
        (date.getUTCHours() + 2).toString().padStart(2, 0) + ":" +
        date.getUTCMinutes().toString().padStart(2, 0));
      where = {
        ...where,
        'ArticleDate' : {$lte: now},
        ...active
      }
      // choose what to or not to display
      let _display = {
        deleted_by_user: 0,
        deleted_by_azdan: 0,
        ...display
      }
      let counter = parseInt(count)
      Schemas.Article
        .find(where, _display, {
          autopopulate
        })
        .skip(counter * 40)
        .limit(40)
        .sort({ ArticleDate: -1 })
        .then(data => {
          resolve(
            helpers.res_obj(
              true,
              {
                data,
                cols
              },
              'Fetched Successfully'
            )
          )
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }
  static get_wadja(count , where = {} , display = {} , cols = [] , autopopulate = false) {
    return new Promise((resolve, reject) => {
      var date = new Date()
      var now = (date.getUTCFullYear() + "-" +
        (date.getUTCMonth() + 1).toString().padStart(2, 0) + "-" +
        date.getUTCDate().toString().padStart(2, 0) + "T" +
        (date.getUTCHours() + 2).toString().padStart(2, 0) + ":" +
        date.getUTCMinutes().toString().padStart(2, 0));
      where = {
        ...where,
        'ArticleDate' : {$lte: now},
        ...active
      }
      // choose what to or not to display
      let _display = {
        deleted_by_user: 0,
        deleted_by_azdan: 0,
        ...display
      }
      let counter = parseInt(count)
      Schemas.Article
        .find(where, _display, {
          autopopulate
        })
        .skip(counter * 10)
        .limit(10)
        .sort( {ArticleDate: - 1} )
        .then(data => {
          resolve(
            helpers.res_obj(
              true,
              {
                data,
                cols
              },
              'Fetched Successfully'
            )
          )
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }
  static Callback(isSuccess, data, respond, message) {
    let response = respond ? data : null
    return helpers.res_obj(isSuccess, response, message)
  }
  // Read
  // get data
  static get_data(schemaName, where = {}, display = {}, cols = [], autopopulate = false) {
    return new Promise((resolve, reject) => {
      // condition of find
      where = {
        ...where,
        ...active
      }

      // choose what to or not to display
      let _display = {
        deleted_by_user: 0,
        deleted_by_azdan: 0,
        ...display
      }

      Schemas[schemaName]
        .find(where, _display, {
          autopopulate
        }).sort({ ArticleDate: -1 })
        .then(data => {
          resolve(
            helpers.res_obj(
              true,
              {
                data,
                cols
              },
              'Fetched Successfully'
            )
          )
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }

  static get_one_data(schemaName, where = {}, display = {}, cols = []) {
    return new Promise((resolve, reject) => {
      // condition of find
      where = {
        ...where,
        ...active
      }

      // choose what to or not to display
      let _display = {
        deleted_by_user: 0,
        deleted_by_azdan: 0,
        ...display
      }

      Schemas[schemaName]
        .findOne(where, _display, {
          autopopulate: false
        })
        .then(data => {
          resolve(
            helpers.res_obj(
              true,
              {
                data,
                cols
              },
              'Fetched Successfully'
            )
          )
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }

  static get_data_azdan(schemaName, where = {}, display = {}) {
    new Promise((resolve, reject) => {
      // condition of find
      where = {
        ...where,
        ...active_azdan
      }

      // choose what to or not to display
      let _display = {
        deleted_by_user: 0,
        deleted_by_azdan: 0,
        ...display
      }

      Schemas[schemaName]
        .find(where, _display, {
          autopopulate: false
        })
        .then(data => {
          resolve(helpers.res_obj(true, data, 'Fetched Successfully'))
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }


  static update_one(schemaName, where, updates) {
    return new Promise((resolve, reject) => {
      Schemas[schemaName]
        .updateOne(where, updates)
        .then(data => {
          if (data.n == 0) {
            reject(helpers.res_obj(false, data, 'no such records'))
          } else {
            resolve(helpers.res_obj(true, data, 'Updated Successfully'))
          }
        })
        .catch(error => {
          reject(helpers.res_obj(false, null, error))
        })
    })
  }

  // static update_many (req, res, schemaName, where, updates) {
  //   Schemas[schemaName]
  //     .update(where, updates)
  //     .then(data => {
  //       if (data.n == 0) {
  //         res.status(401).json(helpers.res_obj(false, data, 'No such records'))
  //       } else if (data.nModified == 0) {
  //         res.status(401).json(helpers.res_obj(false, data, 'Failed to Update'))
  //       } else {
  //         res
  //           .status(201)
  //           .json(helpers.res_obj(true, data, 'Update Successfully'))
  //       }
  //     })
  //     .catch(error => {
  //       res.json(helpers.res_obj(false, error))
  //     })
  // }

  static delete(schemaName, where) {
    return new Promise((resolve, reject) => {
      this.update_one(schemaName, where, {
        $set: {
          deleted_by_user: true
        }
      })
        .then(response => {
          resolve(helpers.res_obj(true, response, 'Deleted Successfully'))
        })
        .catch(err => {
          reject(helpers.res_obj(false, null, err))
        })
    })
  }

  // static delete_azdan (schema, where) {
  //   return new Promise((resolve, reject) => {
  //     this.update_one(schema, where, {
  //       $set: {
  //         deleted_by_azdan: true,
  //         deleted_by_user: true
  //       }
  //     })
  //       .then(response => {
  //         resolve(helpers.res_obj(true, null, 'Deleted Successfully By an Admin'))
  //       })
  //       .catch(err => {
  //         reject(helpers.res_obj(false, null, err))
  //       })
  //   })
  // }
}

const active = {
  $or: [
    {
      deleted_by_user: {
        $exists: false
      }
    },
    {
      deleted_by_user: {
        $ne: true
      }
    }
  ]
}
const active_azdan = {
  $or: [
    {
      deleted_by_azdan: {
        $exists: false
      }
    },
    {
      deleted_by_azdan: {
        $ne: true
      }
    }
  ]
}

module.exports = CRUD
