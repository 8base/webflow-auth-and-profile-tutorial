;(function () {
  new Vue({
    //
    //Component mounts on our div with the ID "profile-page"
    //
    el: '#profile-page',
    data: {
      errors: [],
      //
      // This is what our user data object looks like.
      //
      user: {
        id: '',
        bio: '',
        email: '',
        lastName: '',
        firstName: '',
        avatar: undefined,
        roles: {
          items: []
        }
      },
      //
      // Required credentials for uploading images.
      //
      fileUploadInfo: {},
      //
      // If the user doesn't have an avatar, we'll use this default one.
      //
      defaultAvatar:
        'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg',
      //
      // Our query for getting the user data
      //
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
            avatar {
              downloadUrl
            }
          }

          fileUploadInfo {
            policy
            signature
            apiKey
            path
          }
        }
      `,
      //
      // Our mutation for updating the user data.
      //
      mutation: `
        mutation($data: UserUpdateInput!) {
          userUpdate(data: $data) {
            id
          }
        }
      `,
      //
      // Avatar update mutation
      //
      updateAvatarMutation: `
        mutation($userId: ID!, $fileId: String!, $filename: String!) {
          userUpdate(data: {
            id: $userId
            avatar: {
              create: {
                public: true,
                fileId: $fileId,
                filename: $filename, 
              }
            }
          }) {
            avatar {
              downloadUrl
            }
          }
        }
      `
    },

    computed: {
      //
      // Formats the form data for a profile update
      //
      form () {
        var form = Object.assign({}, { data: this.user })

        delete form.data.roles
        delete form.data.avatar

        return form
      }
    },

    methods: {
      //
      // Gets the user data from the API and sets it as
      // the current user data.
      //
      getUserData () {
        EightBase.api.request({
          data: JSON.stringify({ query: this.query }),
          success: result => {
            this.user = result.data.user
            this.fileUploadInfo = result.data.fileUploadInfo
          }
        })
      },
      //
      // Perform update on user data.
      //
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
      //
      // Open file viewer on avatar click.
      //
      handleAvatarClick () {
        //
        // Initialize the filestack SDK
        //
        const client = filestack.init(this.fileUploadInfo.apiKey, {
          security: {
            policy: this.fileUploadInfo.policy,
            signature: this.fileUploadInfo.signature
          }
        })
        //
        // Open the picker using appropriate file upload options
        //
        client
          .picker({
            fromSources: ['local_file_system', 'instagram', 'facebook'],
            storeTo: {
              location: 's3',
              path: this.fileUploadInfo.path
            },
            onFileSelected: file => {
              if (file.size > 1000 * 1000) {
                throw new Error(
                  'File too big, select something smaller than 1MB'
                )
              }
            },
            onUploadDone: this.updateUserAvatar
          })
          .open()
      },
      //
      // After file is uploaded, update the user with the record.
      //
      updateUserAvatar (result) {
        const file = result.filesUploaded[0]

        EightBase.api.request({
          data: JSON.stringify({
            query: this.updateAvatarMutation,
            variables: {
              fileId: file.handle,
              userId: this.user.id,
              filename: file.filename
            }
          }),
          success: result => {
            if (result.errors) {
              alert('Upload failed! ', result)
              console.log(result)
              return
            }

            this.user.avatar = {
              downloadUrl: result.data.userUpdate.avatar.downloadUrl
            }
          }
        })
      },
      //
      // Logout the user (we'll perform a Logout from the profile page)
      //
      logout (event) {
        if (event) event.preventDefault()
        if (event) event.stopPropagation()

        EightBase.store.clear()

        window.location.replace(EightBase.config.routes.logoutRedirect)

        return false
      }
    },
    //
    // Go fetch the user data once the API
    // is created.
    //
    mounted () {
      this.getUserData()
    }
  })
})()
