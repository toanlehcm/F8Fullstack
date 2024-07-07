/*--------- Constructor function Validator. ------------*/
function Validator(options) {

  var selectorRules = {}

  // Handle validation.
  function validated(inputElement, rule) {
    // Get value in input to check rule.
    var errorMessage;
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

    // Get all rules of selector.
    var rules = selectorRules[rule.selector]

    // Loop through all rules and check. If has error, break.
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value)
      if (errorMessage) break;
    }

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
    //     Handle submit form.
    formElement.onsubmit = function (e) {
      e.preventDefault()

      // Loop through each rules and validate.
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        validated(inputElement, rule)
      });
    }


    // Receive rules configed.
    // Loop through each rules and handle (listen blur event, input,...).
    options.rules.forEach(function (rule) {

      // Save rules for each input.
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test)
      } else {
        selectorRules[rule.selector] = [rule.test]
      }

      // Ge input from form in options.
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        inputElement.onblur = function () {
          // value: get from inputElement.value
          // test: get from rule.test
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
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) { // Receive value from input.

      return value?.trim() ? undefined : message || 'Vui lòng nhập trường này.'
    }
  }
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      return regex.test(value) ? undefined : message || 'Vui lòng nhập email.'
    }
  }
}

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập nhiều hơn ${min} kí tự.`
    }
  }
}

// getConfirmValue is a callback.
Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || 'Giá trị nhập lại không đúng.'
    }
  }
}