require.config({ paths: { 'vs': '/vs' }});
require(['vs/editor/editor.main'], function() {
    var editor = monaco.editor.create(document.querySelector('.monaco-container'), {
        value: localStorage.getItem('code') || [
            'clear()',
            '// write your code here',
            '',
            '',
            'write()'
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

    document.body.querySelector('button#run').addEventListener('click', (e) => {
      e.target.disabled = 'disabled'
      console.log(editor.getValue())
      eval(editor.getValue())
      e.target.removeAttribute('disabled')
    })

    document.body.querySelector('button#send').addEventListener('click', (e) => {
      e.target.disabled = 'disabled'
      window
        .fetch('/exec', {
          method: 'POST',
          body: JSON.stringify({code: editor.getValue()}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          e.target.removeAttribute('disabled')
        })
        .catch((e) => {
          console.error(e)
          e.target.removeAttribute('disabled')
        })
    })

    var storeInterval = window.setInterval(function () {
      localStorage.setItem('code', editor.getValue())
    },1000)

    document.body.querySelector('button#reset').addEventListener('click', (e) => {
      clearInterval(storeInterval)
      localStorage.removeItem('code')
      location.reload()
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

var buffer = []
document.addEventListener('keypress', (e) => {
  buffer.push(String.fromCharCode(e.keyCode))
  if (buffer.length > 7) {
    buffer.shift()
  }
  if (buffer.join('') == 'LEDSEND') {
    document.querySelector('#send').removeAttribute('disabled')
  }
})