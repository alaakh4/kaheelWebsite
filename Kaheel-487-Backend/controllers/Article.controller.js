
const CRUD = require('../helpers/crud')
const helpers = require('../helpers/helpers')
const ArticleModal = require('../models/Article.model')

exports.getArticles = (req, res) => {
  CRUD.get_data('Article', {}, {}, [], false)
    .then(async response => {
      if (response.data.data[0].subType !== undefined && response.data.data[0].subType.length > 0) {
        let sub = {};
        let supers = response.data.data;
        for (let document of supers) {
          let mysub = await CRUD.get_one_data(document._doc.subType, { ArticleId: document._doc._id })
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



exports.createArticle = (req, res, next) => {
  let MediaType = req.body.MediaType
  if (MediaType != 'noMedia' && MediaType != 'img' && MediaType != 'video')
    return res.status(401).send('please check values')
  CRUD.create(req.body, 'Article')
    .then(response => {
      res.status(201).send(response)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}


exports.editArticle = (req, res, next) => {
  let MediaType = req.body.MediaType
  if (MediaType != 'noMedia' && MediaType != 'img' && MediaType != 'video')
    return res.status(401).send('please check values')
  const update = {
    $set: req.body
  }

  CRUD.update_one(
    'Article',
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



exports.getArticleByValue = (req, res, next, filter, Article) => {
  var opr = '$' + req.params.operator
  const filterValue = req.params.value
  let allArticles


  allArticles = {
    [filter]: {
      [opr]: filterValue
    }
  }
  CRUD.get_data(
    'Article',
    allArticles
  )
    .then(response => {
      res.status(201).send(response)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getArticlesWebSite = (req, res, next) => {
  var count = req.params.value
  var allArticles = { $and: [{ 'ClassId': { $ne: 1 } },
   { 'ClassId': { $ne: 2 } }]}
  var wadjaFillter = { 'ClassId': { $eq: 1 } }
  var sliderFillter = { 'ClassId': { $eq: 2 } }
  CRUD.get_Article_webSite(count, 'Article', allArticles)
    // after get all Articles
    .then(response => {
      CRUD.get_wadja(count,wadjaFillter).then(async wadja => {
        // after get wadja
        var Slider
        if (count == 0) {
        await CRUD.get_data('Article', sliderFillter).then(slider => {
            Slider = slider
          })
        }
        let articleWithWadja = response.data.data
        for (c = 0, a = 10; c < wadja.data.data.length; a += 10, c++) {
          if (a < response.data.data.length) {
            articleWithWadja.splice(a, 0, wadja.data.data[c])
          }
          else {
            articleWithWadja.push(wadja.data.data[c])
          }
          // console.log(wadja.data.data[c])
        }
        if (count == 0) {
          articleWithWadja.splice(4, 0, { 'ClassId': 2, 'data': Slider.data.data })
        }
        // console.log(articleWithWadja)
        res.status(201).send({ 'ArticleWithWadja': articleWithWadja, 'Articles': response, 'wadja': wadja })
      }) // end wadja
    }) // end articles
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.deleteArticle = (req, res, next) => {
  CRUD.delete('Article', {
    _id: req.params.id
  })
    .then(response => {
      res.status(201).send(response)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}


exports.addImgArticle = (req, res) => {
  if (req.files != 0) {
    req.files.imageFile.mv('upload/' + req.params.id + '.jpg', (err) => {
      if (err) return res.status(404).send(err)
      res.send('done')
    })
  }
  console.log("req.files.imageFile.data")
}
exports.test = (req, res) => {
  let query = req.body.searchQuery
  let _display = {
    deleted_by_user: 0,
    deleted_by_azdan: 0
  }
  ArticleModal.find({
    $or:
      [{ ArticleDesc: { $regex: query, $options: "ig" } },
      { ArticleName: { $regex: query, $options: "ig" } },
      { ArticleText: { $regex: query, $options: "ig" } }]
  }
  )
    .sort({ ArticleDate: -1 })
    .limit(50)
    .then(response => {
      let arrayArticles = []
      response.forEach(article => {
        if (article.deleted_by_user == false && article.deleted_by_azdan == false) {
          arrayArticles.push(article)
        }
      });
      res.status(200).json({ success: true, data: arrayArticles })
    })
}
