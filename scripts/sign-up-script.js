// Required CDN https://cdn.jsdelivr.net/npm/graphql-request@3.0.0/dist/index.min.js

;(function () {
  /* Get the forgot password form element by its ID */
  var form = $('#sign-up-form')

  /* Signup User with Password Mutation GraphQL Mutation */
  var signUpQuery = `
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

  var signInQuery = `
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

  /* Login user after signup */
  function loginUser (email, password) {
    var variables = {
      authProfileId: EightBase.config.authProfileId,
      password,
      email
    }
    /* Submit request to API */
    EightBase.api.request({
      data: JSON.stringify({ query: signInQuery, variables }),
      beforeSend: null /* Skips auth */,
      success: function (result) {
        debugger
      }
    })
  }

  /* Write submit handler function */
  function handleSubmit (event) {
    /* Get all form fields in one javascript object */
    var variables = EightBase.forms.getData(this)

    /* Add auth profile ID */
    variables.authProfileId = EightBase.config.authProfileId

    /* Submit request to API */
    EightBase.api.request({
      data: JSON.stringify({ query: signUpQuery, variables }),
      beforeSend: null /* Skips auth */,
      success: function () {
        loginUser(variables.email, variables.password)
      }
    })

    return false
  }

  form.submit(handleSubmit)
})()
