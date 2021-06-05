require('dotenv').config()
const { Router } = require('express')
const Oauth = require('../util/Oauth')

const callbackRoute = Router()

callbackRoute.get('/callback', async (req, res) => {
  const { code } = req.query

  if (!code)
    return res.redirect(process.env.LOGIN_URI)
  if (req.session.user)
    req.session.destroy()
  
  const token = await Oauth.getToken({
    grant_type: 'authorization_code',
    code,
  })

  if (!token.scope.includes('guilds') || !token.scope.includes('identify'))
    return res.redirect(`/redirect.html?message=${encodeURIComponent('권한이 부족합니다')}&url=${process.env.LOGIN_URI}`)

  const user = await Oauth.user(token.access_token)
  
  req.session.user_id = user.id
  req.session.token = token
  req.session.logged_on = Date.now()

  res.redirect('/dashboard')
})

module.exports = callbackRoute