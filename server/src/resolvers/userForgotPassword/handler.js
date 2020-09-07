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
 *    userForgotPassword:
 *      ...
 *
 * Data that is sent to this function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * To invoke this function locally, run:
 *  8base invoke-local userForgotPassword -p src/resolvers/userForgotPassword/mocks/request.json
 */

import { auth0Management, auth0Authentication } from '../../auth0'

async function userForgotPassword (event) {
  const { email } = event.data

  let user

  try {
    ;[user] = await auth0Management.getUsersByEmail(email)
  } catch (error) {
    console.error(error)

    return {
      data: {
        success: false
      },
      errors: [error]
    }
  }

  if (!user) {
    const error = new Error('No such a user.')

    console.error(error)

    return {
      data: {
        success: false
      },
      errors: [error]
    }
  }

  try {
    await auth0Authentication.requestChangePasswordEmail({
      email,
      connection: user.identities[0].connection
    })
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

export default userForgotPassword
