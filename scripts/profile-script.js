;(function () {
  new Vue({
    el: '#profile-page',
    data: {
      errors: [],
      user: {
        id: '',
        bio: '',
        email: '',
        lastName: '',
        firstName: '',
        roles: {
          items: []
        }
      },
      query: `
        query {
          user {
            id
            bio
            email
            lastName
            firstName
            roles {
              items {
                id
                name
              }
            }
          }
        }
      `,
      mutation: `
        mutation($data: UserUpdateInput!) {
          userUpdate(data: $data) {
            id
          }
        }
      `
    },

    computed: {
      form () {
        var form = Object.assign({}, { data: this.user })

        delete form.data.roles

        return form
      }
    },

    methods: {
      getUserData () {
        EightBase.api.request({
          data: JSON.stringify({ query: this.query }),
          success: result => (this.user = result.data.user)
        })
      },

      updateUserData (event) {
        if (event) event.preventDefault()
        if (event) event.stopPropagation()

        EightBase.api.request({
          data: JSON.stringify({
            query: this.mutation,
            variables: this.form
          }),
          success: this.getUserData
        })
      },

      logout (event) {
        if (event) event.preventDefault()
        if (event) event.stopPropagation()

        EightBase.store.clear()

        window.location.replace(EightBase.config.routes.logoutRedirect)

        return false
      }
    },

    mounted () {
      this.getUserData()
    }
  })
})()
