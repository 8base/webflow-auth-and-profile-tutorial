/**
 * This file was generated using 8base CLI.
 *
 * To learn more about writing custom GraphQL resolver functions, visit
 * the 8base documentation at:
 *
 * https://docs.8base.com/8base-console/custom-functions/resolvers
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    userUpdatePassword:
 *      ...
 *
 * Data that is sent to this function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * To invoke this function locally, run:
 *  8base invoke-local userUpdatePassword -p src/resolvers/userUpdatePassword/mocks/request.json
 */
import { auth0Management } from '../../auth0'

const GET_USER = `
  query GetUser {
    user {
      id
      email
    }
  }
`

async function userUpdatePassword (event, ctx) {
  const { password } = event.data

  const { user: eightBaseUser } = (await ctx.api.gqlRequest(GET_USER)) || {}

  if (!eightBaseUser) {
    const error = new Error(`Couldn't identify a user.`)
    console.error(error)

    return {
      data: {
        success: false
      },
      errors: [error]
    }
  }

  let user

  try {
    ;[user] = await auth0Management.getUsersByEmail(eightBaseUser.email)
  } catch (error) {
    console.error(error)

    return {
      data: {
        success: false
      },
      errors: [error]
    }
  }

  const id = `${user.identities[0].provider}|${user.identities[0].user_id}`

  try {
    await auth0Management.updateUser(
      {
        id
      },
      {
        password
      }
    )
  } catch (error) {
    console.error(error)

    return {
      data: {
        success: false
      },
      errors: [error]
    }
  }

  return {
    data: {
      success: true
    }
  }
}

export default userUpdatePassword
