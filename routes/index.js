var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})
router.post('/exec', (req, res) => {
  var rpio = require('rpio')
  rpio.init({mapping: 'gpio', gpiomem: false})

  var numLED = 0
  var ledBuffer = Buffer.alloc(1)
  var finishedSetup = false

  function notSetupMessage () {
    console.log('Not setup.')
  }

  function setup (num, clock) {
    numLED = num
    ledBuffer = Buffer.alloc((numLED * 4) + 8)
    finishedSetup = true
    rpio.spiBegin()
    rpio.spiSetClockDivider(clock || 128)
  }

  function set (r, g, b, brightness) {
    if (!finishedSetup) {
      notSetupMessage()
      return
    }
    // Check if brightness is not set or out of range. If so, set to full.
    if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF

    for (var currentIndex = 0; currentIndex < numLED; currentIndex++) {
      // Sets brightness of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 0] = brightness
      // Sets blue of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 1] = b
      // Sets green of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 2] = g
      // Sets red of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 3] = r
    }
  }

  function setPixel (index, r, g, b, brightness) {
    if (!finishedSetup) {
      notSetupMessage()
      return
    }
    console.log(index)
    // Check if brightness is not set or out of range. If so, set to full.
    if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF
    // Sets brightness of pixel at index
    ledBuffer[4 + (index * 4) + 0] = brightness
    // Sets blue of pixel at index
    ledBuffer[4 + (index * 4) + 1] = b
    // Sets green of pixel at index
    ledBuffer[4 + (index * 4) + 2] = g
    // Sets red of pixel at index
    ledBuffer[4 + (index * 4) + 3] = r
  }

  function write () {
    if (!finishedSetup) {
      notSetupMessage()
      return
    }
    rpio.spiWrite(ledBuffer, (numLED * 4) + 8)
  }

  function clear () {
    if (!finishedSetup) {
      notSetupMessage()
      return
    }
    for (var currentIndex = 0; currentIndex < numLED; currentIndex++) {
      // Sets blue of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 1] = 0
      // Sets green of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 2] = 0
      // Sets red of pixel at current index
      ledBuffer[4 + (currentIndex * 4) + 3] = 0
    }
  }

  setup(60)
  clear()
  write()
  if (req.body.code) {
    console.log(req.body.code)
    eval(req.body.code)
    res.json({'ran': true})
  } else {
    res.json({'ran': false})
  }
})

module.exports = router