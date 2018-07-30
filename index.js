var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

var app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(require('stylus').middleware('public'))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/vs', express.static(path.join(__dirname, 'node_modules/monaco-editor/min/vs')))
app.use('/', require('./routes/index'))

var server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App served on localhost:${server.address().port}`)
})