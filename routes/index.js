const home = require('./home')
const add = require('./add')
const courses = require('./courses')
const search = require('./search')
const about = require('./about')
const card = require('./card')
const favorite = require('./favorite')
const orders = require('./orders')
const auth = require('./auth')
const profile = require('./profile')
const xml = require('./xml')
const admin = require('./admin')

const router = {
    home,
    add,
    about,
    courses,
    search,
    card,
    orders,
    auth,
    profile,
    xml,
    favorite,
    admin
}

module.exports = router