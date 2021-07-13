const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const isEqual = require('./tool/handlebarHelpers')
const routes = require('./routes')
require('./config/mongoose')

app.engine('hbs', exphbs({defaultlayout:'main', extname:'hbs', helpers:{isEqual}}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(routes)





app.listen(port, () => {
  console.log(`this is running express http://localhost:${port}`)
})

