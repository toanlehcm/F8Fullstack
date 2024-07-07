/*--------- Constructor function Validator. ------------*/
function Validator(options) {

  /** 
   * element: input element.
   * selector: element has class 'form-group'.
   * */
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }

      element = element.parentElement
    }
  }

  var selectorRules = {}

  // Handle validation through all rules.
  function validated(inputElement, rule) {
    // Get value in input to check rule.
    var errorMessage;
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

    // Get all rules of selector.
    var rules = selectorRules[rule.selector]

    // Loop through all rules and check. If has error, break.
    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
          break;

        default:
          errorMessage = rules[i](inputElement.value)
          break;
      }

      if (errorMessage) break;
    }

    if (errorMessage) {
      // Get parent element of inputElement. Then find span element to show message.
      errorElement.innerText = errorMessage

      // Add class error to inputElement.
      getParent(inputElement, options.formGroupSelector).classList.add('invalid')
    } else {
      errorElement.innerText = ''
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
    }

    return !errorMessage
  }

  // Get element of form that need to validate.
  var formElement = document.querySelector(options.form);

  if (formElement) {
    //     Handle submit form.
    formElement.onsubmit = function (e) {
      e.preventDefault()

      var isFormValid = true

      // Loop through each rules and validate.
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validated(inputElement, rule)
        if (!isValid) {
          isFormValid = false
        }
      });



      if (isFormValid) {
        // Handle submit form with javascript.
        if (typeof options.onSubmit === 'function') {

          // Query Selector All get all input elements has name and not disabled.
          var enableInput = formElement.querySelectorAll('[name]:not([disabled])')

          var formValues = Array.from(enableInput).reduce(function (values, input) {
            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value
                break;
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = ''
                  return values
                };

                if (!Array.isArray(values[input.name])) {
                  values[input.name] = []
                }

                values[input.name] = [...values[input.name], input.value]
                break;

              case 'file':
                values[input.name] = input.files
                break;

              default:
                // 1. Set input.value for values[input.name].
                values[input.name] = input.value
                break;
            }

            // 2. Return values
            return values
          }, {})

          options.onSubmit(formValues)
        }

        // Handle submit form with default behavior.
        else {
          formElement.submit()
        }
      }
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
      var inputElements = formElement.querySelectorAll(rule.selector);

      // inputElements is Nodelist, so need to convert to array. https://developer.mozilla.org/en-US/docs/Web/API/NodeList/
      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          inputElement.onblur = function () {
            // value: get from inputElement.value
            // test: get from rule.test
            // Handle for case blur outside input element.
            validated(inputElement, rule)

            // Handle for case whenever user is typing.
            inputElement.oninput = function () {
              var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
              errorElement.innerText = ''
              getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            }
          }
        }
      })
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
      // TODO: fix radio.
      // errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
      return value?.trim() ? undefined : message || 'Vui lòng nhập trường này.'
    }
  }
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      return regex.test(value) ? undefined : message || 'Vui lòng nhập đúng kiểu email!'
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