require.config({ paths: { 'vs': '/vs' }});
require(['vs/editor/editor.main'], function() {
    var editor = monaco.editor.create(document.querySelector('.monaco-container'), {
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        language: 'javascript',
        fontSize: 20,
        quickSuggestions: false
    });

    window.onresize = function () {
      if (editor) {
        editor.layout();
      }
    }

    document.body.querySelector('button#run').addEventListener('click', () => {
      console.log(editor.getValue())
      eval(editor.getValue())
    })

    document.body.querySelector('button#send').addEventListener('click', (e) => {
      window
        .fetch('/exec', {
          method: 'POST',
          body: JSON.stringify({code: editor.getValue()}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => res.json)
        .then((json) => {
          console.log(json)
        })
    })
  });

var pixels = document.querySelectorAll('.led-strip__pixel')
var numLED = 60
var ledBuffer = Array(60)
for (var i = 0; i < numLED; i++) {
  ledBuffer[i] = [0, 0, 0]
}

function set (r, g, b, brightness) {
  // Check if brightness is not set or out of range. If so, set to full.
  if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF

  for (var currentIndex = 0; currentIndex < numLED; currentIndex++) {
    // Sets red of pixel at current index
    ledBuffer[currentIndex][0] = r
    // Sets green of pixel at current index
    ledBuffer[currentIndex][1] = g
    // Sets blue of pixel at current index
    ledBuffer[currentIndex][2] = b
  }
}

function setPixel (index, r, g, b, brightness) {
  // Check if brightness is not set or out of range. If so, set to full.
  if (!(brightness >= 0xE0 && brightness <= 0xFF)) brightness = 0xFF
  // Sets red of pixel at current index
  ledBuffer[index][0] = r
  // Sets green of pixel at current index
  ledBuffer[index][1] = g
  // Sets blue of pixel at current index
  ledBuffer[index][2] = b
}

function write () {
  for (var i = 0; i < numLED; i++) {
    var red = ledBuffer[i][0]
    var green = ledBuffer[i][1]
    var blue = ledBuffer[i][2]
    pixels[i].style = `background: rgb(${red}, ${green}, ${blue})`
  }
}

function clear () {
  for (var i = 0; i < numLED; i++) {
    ledBuffer[i][0] = 0
    ledBuffer[i][1] = 0
    ledBuffer[i][2] = 0
    pixels[i].style = `background: rgb(0, 0, 0)`
  }
}
  
window.addEventListener("beforeunload", (e) => {
  e.returnValue = ''
})