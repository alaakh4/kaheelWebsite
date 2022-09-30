const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const app = express()
const fileUpload=require('express-fileupload')

// make enviroment variables accessible
require('dotenv').config()
// establish db connection
require('./database')
require('dotenv').config({ path: 'ENV_FILENAME' });
// routes
// auth
const passport = require('passport')
/*const {
  FindById,
  JWT_OPTIONS,
  JwtStrategy
} = require('./middleware/check-auth')
*/
// MY edit for AUTH


// body parser
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(fileUpload())
app.use('/upload',express.static(path.join(__dirname,'/upload')))
app.use(morgan('dev'))
app.use('/images', express.static(path.join(__dirname, '/public/')))
app.use('/public', express.static(path.join(__dirname, '/public/')))

/*passport.use(
  new JwtStrategy(
    JWT_OPTIONS,
    async (jwt_payload, done) => await FindById(jwt_payload, done)
  )
)*/

// allowing CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, auth-token',
    "server",
    "date",
    "content-type",
    "content-length",
    "connection",
    "access-control-allow-origin",
    "access-control-allow-methods",
    "access-control-allow-headers",
    "access-control-max-age",
    "x-no-cors-reason"
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  )
  next()
})
// app routes
const Class_route = require('./routes/Class.routes')
const Article_route = require('./routes/Article.routes')
const Setting_route = require('./routes/Setting.routes')
const auth_route=require('./routes/Auth.routes')
app.use('/api/Class', Class_route)
app.use('/api/Article', Article_route)
app.use('/api/Setting', Setting_route)
app.use('/api',auth_route)
module.exports = app
