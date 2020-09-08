;(() => {
  new Vue({
    el: '#sign-in-form',
    data: {
      errors: [],
      form: {
        email: '',
        password: '',
        authProfileId: EightBase.config.authProfileId
      },
      query: `
        mutation(
          $email: String!,
          $password: String!,
          $authProfileId: ID!
        ) {
          userLogin(data: {
            email: $email,
            password: $password,
            authProfileId: $authProfileId
          }) {
            success
            auth {
              idToken
              refreshToken
            }
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

        EightBase.store.set('auth', result.data.userLogin.auth)
        window.location.replace(EightBase.config.routes.loginRedirect)
      },

      login (event) {
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
