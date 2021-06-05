require('dotenv').config()
const DiscordOauth = require('oauth-discord')
const Oauth = new DiscordOauth({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
})

module.exports = Oauth