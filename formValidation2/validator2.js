/*--------- Constructor function Validator. ------------*/
function Validator2(formSelector, options) {
  // Set default value for param (ES5)
  if (!options) {
    options = {}
  }

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }

      element = element.parentElement
    }
  }

  var formRules = {}

  /**
   * Rules creation convention:
   * - if has error: return message error.
   * - if validated: return undefined.
   * */

  var validatorRules = {
    required: function (value) {
      return value ? undefined : 'Vui lòng nhập trường này'
    },
    email: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regex.test(value) ? undefined : 'Vui lòng nhập đúng kiểu email!'
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự.`
      }
    },
    max: function (max) {
      return function (value) {
        return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự.`
      }
    }
  }

  // Get form element in DOM based on selector.
  var formElement = document.querySelector(formSelector)
  // Only handle when has element in DOM.
  if (formElement) {

    // Get all input elements has name and rules attributes.
    var inputs = formElement.querySelectorAll('[name][rules]')
    for (var input of inputs) {
      var rules = input.getAttribute('rules').split('|')

      // Convert string rules from attributes rules to function handle.
      for (var rule of rules) {
        var isRuleHasValue = rule.includes(':') // for min, max rule.
        var ruleInfo;

        if (isRuleHasValue) {
          ruleInfo = rule.split(':')

          // Override rule: min:3 => min.
          rule = ruleInfo[0]
        }

        // Assign function handle to each rule.
        var ruleFunc = validatorRules[rule];

        // Send min/max value to function handle rule min/max.
        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1])
        }

        // Assign function handle rule for each input.
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc)
        } else {
          formRules[input.name] = [ruleFunc]
        }
      }

      // Listen event to validate(blur, change,...)
      input.onblur = handleValidate;
      input.oninput = handleClearErrorMessage;
    }

    function handleValidate(event) {
      var rules = formRules[event.target.name]
      var errorMessage;

      rules.find(function (rule) {
        errorMessage = rule(event.target.value);
        return errorMessage
      })

      if (errorMessage) {
        var formGroup = getParent(event.target, '.form-group')

        if (!formGroup) return

        formGroup.classList.add('invalid')

        var formMessage = formGroup.querySelector('.form-message');
        if (formMessage) {
          formMessage.innerText = errorMessage
        }
      }

      return !errorMessage
    }

    function handleClearErrorMessage(event) {
      var formGroup = getParent(event.target, '.form-group')
      if (formGroup.classList.contains('invalid')) {
        formGroup.classList.remove('invalid');

        var formMessage = formGroup.querySelector('.form-message');
        if (formMessage) {
          formMessage.innerText = ''
        }
      }
    }


    // Handle submit form.
    formElement.onsubmit = function (event) {
      event.preventDefault();

      // Get all input elements has name and rules attributes.
      var inputs = formElement.querySelectorAll('[name][rules]')
      var isValid = true;

      for (var input of inputs) {
        if (!handleValidate({ target: input })) {
          isValid = false
        }
      }

      // If has not error, submit form.
      if (isValid) {
        // if (this.onSubmit) {
        //   this.onSubmit();
        // } else {
        // }

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

          // Call back function obsubmit and return form values.
          options.onSubmit(formValues);
        } else {
          formElement.submit();
        }
      }
    }
  }
}
