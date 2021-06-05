require('dotenv').config()
const Oauth = require('../util/Oauth')
const getNewToken = require('../util/getNewToken')
const callbackRoute = require('./callback')

module.exports = 
/**
 * @param {import('discord.js').Client} client 
 * @param {import('express').Application} app 
 */
(client, app) => {
  app.get('/', async (req, res) => {
    if (req.session.user) 
      res.render('index', { user: true })
    else
      res.render('index', { user: false })
  })
  
  app.get('/callback', callbackRoute)

  app.get('/dashboard', async (req, res) => {
    if (!req.session.token || !req.session.user_id)
      return res.redirect(process.env.LOGIN_URI)
    if (req.session.logged_on + req.session.token.expires_in >= Date.now() - 100)
      await getNewToken(req)
      
    const user = client.users.cache.get(req.session.user_id)
    const guilds = await Oauth.userGuilds(req.session.token.access_token)
    
    if (!user)
      return res.redirect(`/redirect.html?message=${encodeURIComponent('봇이 접근할 수 있는 유저가 아닙니다')}&url=${encodeURIComponent(process.env.LOGIN_URI)}`)

    res.render('dashboard/dashboard', {guilds})
  })
}  