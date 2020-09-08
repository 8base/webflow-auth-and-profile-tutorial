;(() => {
  new Vue({
    el: '#sign-up-form',
    data: {
      errors: [],
      form: {
        email: '',
        password: '',
        lastName: '',
        firstName: '',
        authProfileId: EightBase.config.authProfileId
      },
      signInMutation: `
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
      `,
      signUpMutation: `
        mutation(
          $authProfileId: ID!
          $password: String!
          $firstName: String
          $lastName: String
          $email: String!

        ) {
          userSignUpWithPassword(
            authProfileId: $authProfileId,
            password: $password
            user: {
              firstName: $firstName
              lastName: $lastName
              email: $email
            }
          ) {
            id
            createdAt
          }
        }
      `
    },
    methods: {
      handleError (error) {
        console.log(error)
      },

      login (result) {
        if (result.errors.length) {
          this.errors = result.errors
          return
        }

        /* Submit request to API */
        EightBase.api.request({
          data: JSON.stringify({
            query: this.signInMutation,
            variables: this.form
          }),
          success: result => {
            EightBase.store.set('auth', result.data.userLogin.auth)
            window.location.replace(EightBase.config.routes.loginRedirect)
          },
          error: this.error,
          /* Skips auth */
          beforeSend: null
        })
      },

      signUp (event) {
        if (event) event.preventDefault()
        if (event) event.stopPropagation()

        console.log('Logging in user...')

        /* Submit request to API */
        EightBase.api.request({
          data: JSON.stringify({
            query: this.signUpMutation,
            variables: this.form
          }),
          success: this.login,
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
