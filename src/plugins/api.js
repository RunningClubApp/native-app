import * as config from '../../api.config.json'

import { getUserToken } from './userstore'

function get(path, includeUserToken) {
  return call(path, {}, 'GET', includeUserToken)
}

function post(path, body, includeUserToken) {
  return call(path, body, 'POST', includeUserToken)
}

function patch(path, body, includeUserToken) {
  return call(path, body, 'PATCH', includeUserToken)
}

async function call(path, body, method, includeUserToken) {
  const token = await getUserToken()
  return new Promise((resolve, reject) => {
    const protocol = config.secure ? 'https' : 'http'

    const mark = path.includes('?') ? '&' : '?'
    const tokenargs = includeUserToken ? `${mark}token=${token}` : ''

    const url = `${protocol}://${config.host}/${path}${tokenargs}`

    fetch(url, {
          method: method,
          body: method !=='GET' ? JSON.stringify(body) : undefined,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then((data) => {
          console.log(`<<< recieved data[${JSON.stringify(data)}]`)
          return data
        })
        .then(d => resolve(d))
        .catch(e => reject(e))
  })
}

export { get, post, patch }