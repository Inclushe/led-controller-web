var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})
router.post('/exec', (req, res) => {
  
  if (req.body.code) {
    console.log(req.body.code)
    eval(req.body.code)
    res.json({'ran': true})
  } else {
    res.json({'ran': false})
  }
})

module.exports = router