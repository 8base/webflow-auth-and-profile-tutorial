;(function () {
  /* Get the forgot password form element by its ID */
  var form = $('#forgot-password-form')

  /* User forgot password GraphQL Mutation */
  var query = `
    mutation($email: String!) {
      userForgotPassword(email: $email) {
        success
      }
    }
  `

  /* Write submit handler function */
  function handleSubmit (event) {
    /* Get all form fields in one javascript object */
    var variables = EightBase.forms.getData(this)

    /* Submit request to API */
    EightBase.api.request({
      data: JSON.stringify({ query, variables }),
      beforeSend: null /* Skips auth */,
      success: function (result) {
        if (result.errors.length > 0) {
          result.errors.forEach(console.log)
        }
      }
    })

    return false
  }

  form.submit(handleSubmit)
})()
