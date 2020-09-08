/* Accessible globally on webflow site */
window.EightBase = (config => {
  /* Helper object for handling local storage */
  var store = {
    /* Access value in localStorage */
    get: key => {
      return JSON.parse(localStorage.getItem(key))
    },

    /* Set value in localStorage */
    set: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value))

      return value
    },

    /* Remove Item from localStorage */
    remove: key => {
      localStorage.removeItem(key)
    },

    /* Clear values from localStorage */
    clear: () => {
      localStorage.clear()
    },

    /* Helper for determining if user is authenticated */
    isAuthenticated: () => {
      let auth = JSON.parse(localStorage.getItem('auth'))

      return Boolean(auth) && Boolean(auth.idToken)
    }
  }

  /* Guard protected routes */
  let isProtectedRoute = config.routes.private.some(p =>
    window.location.pathname.match(p)
  )

  if (isProtectedRoute && !store.isAuthenticated()) {
    window.location.replace(config.routes.logoutRedirect)
  }

  /* Configure Ajax */
  var api = {
    request: (opts = {}) => {
      return $.ajax(
        Object.assign(
          {
            type: 'POST',
            url: config.endpoint,
            contentType: 'application/json',
            beforeSend: xhr => {
              var { idToken } = store.get('auth')

              xhr.setRequestHeader('Authorization', 'Bearer ' + idToken)
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
    api
  }
})({
  /* Set the 8base API Endpoint */
  endpoint: 'https://api.8base.com/ckcp42med00ru07mf66mnfbk3',
  authProfileId: 'ckekgvcff00b407l78ey83t32',
  routes: {
    loginRedirect: '/profile',
    logoutRedirect: '/sign-in',
    private: ['/profile']
  }
})
