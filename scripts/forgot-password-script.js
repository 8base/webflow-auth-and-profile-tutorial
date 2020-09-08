;(function () {
  new Vue({
    el: '#forgot-password-form',
    data: {
      errors: [],
      form: {
        email: ''
      },
      query: `
        mutation($email: String!) {
          userForgotPassword(email: $email) {
            success
          }
        }
      `
    },
    methods: {
      handleError (error) {
        console.log(error)
      },

      handleSuccess (result) {
        if (result.errors && result.errors.length) {
          this.errors = result.errors
          return
        }

        window.location.replace(EightBase.config.routes.logoutRedirect)
      },

      handleSubmit (event) {
        if (event) event.preventDefault()
        if (event) event.stopPropagation()

        /* Submit request to API */
        EightBase.api.request({
          data: JSON.stringify({
            query: this.query,
            variables: this.form
          }),
          success: this.handleSuccess,
          error: this.handleError,
          /* Skips auth */
          beforeSend: null
        })

        return false
      }
    },
    watch: {
      errors (errors) {
        errors.forEach(console.log)
      }
    }
  })
})()
