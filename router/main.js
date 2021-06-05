require('dotenv').config()
const Oauth = require('../util/Oauth')
const getNewToken = require('../util/getNewToken')
const callbackRoute = require('./callback')
const Canvas = require('canvas')

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
    const vaildGuild = []

    guilds.map(async g => {
      if (g.permissions == 137438953471) {
        const canvas = Canvas.createCanvas(64, 64)
        const ctx = canvas.getContext('2d')
        if (g.icon) {
          const icon = await Canvas.loadImage(`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg?size=128`)
          ctx.drawImage(icon, 25, 25, canvas.width, canvas.height)
        } else {
          ctx.fillStyle = '#2c2f33'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.font = '15px sans-serif'
          ctx.fillStyle = '#ffffff'
          ctx.fillText(g.name, 0, canvas.height / 2)
          ctx.beginPath()
          ctx.arc(canvas.width, canvas.height, 100, 0, Math.PI * 2, true)
          ctx.stroke()
          ctx.closePath()
        }
        
        vaildGuild.push({
          id: g.id,
          name: g.name,
          icon: canvas.toDataURL(),
        })
      }
    })

    if (!user)
      return res.redirect(`/redirect.html?message=${encodeURIComponent('봇이 접근할 수 있는 유저가 아닙니다')}&url=${encodeURIComponent(process.env.LOGIN_URI)}`)

    res.render('dashboard/dashboard', {guilds: vaildGuild})
  })
}  