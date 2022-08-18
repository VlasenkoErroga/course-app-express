"use strict";
const express = require('express')
const path = require('path')
const multer = require('multer')
const csrf  = require('csurf')
const flash = require('connect-flash')
const exhbs = require('express-handlebars')
const router = require('./routes/index')
const helmet = require('helmet')
const mongoose = require('mongoose')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars')
const middlewere = require('./middlewere/index')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const variable = require('./var')

const app = express()

const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils')
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

const store = new MongoStore({
    collection: 'sessions',
    uri: variable.MONGODB_URI
}) 


app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'img')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret:variable.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(middlewere.file.single('file'))
app.use(csrf ())
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: false,
  }))
app.use(compression())

app.use(middlewere.variable)
app.use(middlewere.user)

app.use('/', router.home)
app.use('/add', router.add)
app.use('/courses', router.courses)
app.use('/search', router.search)
app.use('/about', router.about)
app.use('/card', router.card)
app.use('/favorite', router.favorite)
app.use('/orders', router.orders)
app.use('/auth', router.auth)
app.use('/profile', router.profile)
app.use('/admin', router.admin)


//404
app.use(middlewere.error)

const PORT = process.env.PORT || 3000

async function start() {

    try {

        await mongoose.connect(variable.MONGODB_URI, {
            useNewUrlParser: true
        })

        app.listen(PORT, () => {
            console.log(`Server is running no port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()
