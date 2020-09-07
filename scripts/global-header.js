/* Accessible globally on webflow site */
window.EightBase = (function (config) {
  /* Helper object for handling local storage */
  var store = {
    /* Access value in localStorage */
    get: function (key) {
      return localStorage.getItem(key)
    },
    /* Set value in localStorage */
    set: function (key, value) {
      localStorage.setItem(key, value)

      return value
    },
    /* Remove Item from localStorage */
    remove: function (key) {
      localStorage.removeItem(key)
    },
    /* Clear values from localStorage */
    clear: function () {
      localStorage.clear()
    }
  }

  /* Helpers when handling forms */
  var forms = {
    getData: function (form) {
      return $(form)
        .serializeArray()
        .reduce(function (obj, input) {
          obj[input.name] = input.value
          return obj
        }, {})
    }
  }

  /* Configure Ajax */
  var api = {
    request: function (opts = {}) {
      return $.ajax(
        Object.assign(
          {
            type: 'POST',
            url: config.endpoint,
            contentType: 'application/json',
            beforeSend: function (xhr) {
              xhr.setRequestHeader(
                'Authorization',
                'Bearer ' + store.get('idToken')
              )
            }
          },
          opts
        )
      )
    }
  }

  return {
    config,
    store,
    forms,
    api
  }
})({
  /* Set the 8base API Endpoint */
  endpoint: 'https://api.8base.com/ckcp42med00ru07mf66mnfbk3',
  authProfileId: 'ckekgvcff00b407l78ey83t32'
})
