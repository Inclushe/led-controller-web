/*
  Buffer contains in order:
    Start frame: 4 empty bytes (0x00 0x00 0x00 0x00)
    For each pixel (4 bytes):
      Brightness: 111 + 5 bits = 1 byte (0xE0 through 0xFF)
      Blue: 1 byte (0x00 through 0xFF)
      Green: 1 byte (0x00 through 0xFF)
      Red: 1 byte (0x00 through 0xFF)
    End frame: 4 empty bytes (0x00 0x00 0x00 0x00)
*/


function Controller (num, clock) {
  this.numLED = 0
  this.ledBuffer = []
  this.finishedSetup = false
  if (num) {
    if (clock) this.setup(num, clock)
    else this.setup(num)
  }
}

Controller.prototype.notSetupMessage = function () {
  console.log('Not setup.')
}

Controller.prototype.setup = function (num, clock) {
  this.numLED = num
  this.ledBuffer = Array(num)
  this.finishedSetup = true
  for (var i = 0; i < this.numLED; i++) {
    this.ledBuffer[i] = [0, 0, 0]
  }
}

Controller.prototype.set = function (r, g, b, brightness) {
  if (!this.finishedSetup) {
    this.notSetupMessage()
    return
  }
  // Check if brightness is not set or out of range. If so, set to full.
  if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF

  for (var currentIndex = 0; currentIndex < this.numLED; currentIndex++) {
    // Sets red of pixel at current index
    this.ledBuffer[currentIndex][0] = r
    // Sets green of pixel at current index
    this.ledBuffer[currentIndex][1] = g
    // Sets blue of pixel at current index
    this.ledBuffer[currentIndex][2] = b
  }
}

Controller.prototype.setPixel = function (index, r, g, b, brightness) {
  if (!this.finishedSetup) {
    this.notSetupMessage()
    return
  }
  // Check if brightness is not set or out of range. If so, set to full.
  if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF
  // Sets red of pixel at current index
  this.ledBuffer[currentIndex][0] = r
  // Sets green of pixel at current index
  this.ledBuffer[currentIndex][1] = g
  // Sets blue of pixel at current index
  this.ledBuffer[currentIndex][2] = b
}

Controller.prototype.write = function () {
  if (!this.finishedSetup) {
    this.notSetupMessage()
    return
  }
  for (var i = 0; i < this.numLED; i++) {
    var red = this.ledBuffer[i][0]
    var green = this.ledBuffer[i][1]
    var blue = this.ledBuffer[i][2]
    pixels[i].style = `background: rgb(${red}, ${green}, ${blue})`
  }
}