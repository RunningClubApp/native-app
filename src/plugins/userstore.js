function setUserToken (token) {
  console.log(`<-- storing token: ${JSON.stringify({ token })}`)
  window.localStorage.setItem('user_token', JSON.stringify({ token }))
}

function getUserToken () {
  return new Promise((resolve) => {
    const token = window.localStorage.getItem('user_token')
    const parsed = JSON.parse(token)
    console.log(`--> retrieving token: ${token}`)
    if (parsed === null || parsed === undefined) {
      resolve(undefined)
    } else {
      resolve(parsed.token)
    }
  })
}

export { setUserToken, getUserToken }
