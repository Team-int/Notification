require('dotenv').config()
const PORT = process.env.PORT || 3000

const express = require('express')
const session = require('express-session')
const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET
}))

app.get('/', async (req, res) => {
  if (req.session.user) 
    res.render('index', { user: true })
  else
    res.render('index', { user: false })
})

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`)
})