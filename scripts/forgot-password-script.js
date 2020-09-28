;(function () {
  new Vue({
    // Component mounts on the element with the ID sign-in-form
    el: '#forgot-password-form',
    data: {
      errors: [],
      form: {
        email: '',
        authProfileId: EightBase.config.authProfileId
      },
      // The gql mutation to trigger the reset password email
      query: `
        mutation($authProfileId: ID!, $email: String!) {
          userPasswordForgot(data: {
            email: $email,
            authProfileId: $authProfileId
          }) {
            success
          }
        }
      `
    },
    methods: {
      handleError (error) {
        console.log(error)
      },

      // If the call was successful, we navigate back to the logoutRedirect route
      handleSuccess (result) {
        if (result.errors && result.errors.length) {
          this.errors = result.errors
          return
        }

        window.location.replace(EightBase.config.routes.logoutRedirect)
      },

      // The submit handler attached to our form button.
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
