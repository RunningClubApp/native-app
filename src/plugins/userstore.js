function setUserToken (token) {
  window.localStorage.setItem('user_token', JSON.stringify({ token }))
}

function getUserToken () {
  return new Promise((resolve) => {
    const token = window.localStorage.getItem('user_token')
    const parsed = JSON.parse(token)
    resolve(parsed)
  })
}

export { setUserToken, getUserToken }
