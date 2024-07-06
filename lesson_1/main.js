var brand = 'F8'
var course = 'JS Fullstack'

function highlight([first, ...strings], ...values) {
  var htmlString = values.reduce(function (acc, curr, index) {
    // console.log(index, acc, curr);

    var eleShift = strings.shift()
    // console.log(eleShift);

    return acc = `${acc}<span style="color: red">${curr}</span>${eleShift}`
  }, first)

  // console.log(htmlString)

  var root = document.getElementById('root')
  root.innerHTML = htmlString
}

highlight`Hoc lap trinh ${course} tại ${brand} !`

function highlightV2([first, ...strings], ...values) {
  return values.reduce(
    (acc, curr) => [...acc, `<span style="color: red">${curr}</span>`, strings.shift()],
    [first]).join('')
}

var htmlStringV2 = highlightV2`Hoc lap trinh ${course} tại ${brand} !`
var rootV2 = document.getElementById('root_v2')
rootV2.innerHTML = htmlStringV2