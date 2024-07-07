/*--------- Constructor function Validator. ------------*/
function Validator(options) {

  // Handle validation.
  function validated(inputElement, rule) {
    // Get value in input to check rule.
    var errorMessage = rule.test(inputElement.value)
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);


    if (errorMessage) {
      // Get parent element of inputElement. Then find span element to show message.
      errorElement.innerText = errorMessage

      // Add class error to inputElement.
      inputElement.parentElement.classList.add('invalid')
    } else {
      errorElement.innerText = ''
      inputElement.parentElement.classList.remove('invalid')
    }
  }

  // Get element of form that need to validate.
  var formElement = document.querySelector(options.form);

  if (formElement) {
    // Receive rules configed.
    options.rules.forEach(function (rule) {

      // Ge input from form in options.
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        inputElement.onblur = function () {
          // value: get from inputElement.value
          // test: get from rule.test
          console.log('inputElement', rule);
          // Handle for case blur outside input element.
          validated(inputElement, rule)

          // Handle for case whenever user is typing.
          inputElement.oninput = function () {
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
          }
        }
      }
    });
  }
}

/*--------- Defined rules. ------------*/
// Principle of rules:
// 1. when have error : return message error.
// 2. when validated : return undefined.
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) { // Receive value from input.

      return value?.trim() ? undefined : 'Vui lòng nhập trường này.'
    }
  }
}

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      return regex.test(value) ? undefined : 'Vui lòng nhập email.'
    }
  }
}

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      console.log('value', value);
      return value.length >= min ? undefined : `Vui lòng nhập nhiều hơn ${min} kí tự.`
    }
  }
}