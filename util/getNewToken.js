const Oauth = require('./Oauth')

module.exports = async req => {
  const token = await Oauth.getToken({
    grant_type: 'refresh_token',
    refresh_token: req.session.token.refresh_token
  })
  req.session.token = token
  req.session.logged_on = Date.now()
}