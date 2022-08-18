const variable = require('./variables')
const auth = require('./auth')
const root = require('./root')
const user = require('./user')
const error = require('./error')
const file = require('./file')

module.exports = {
    variable,
    auth,
    file,
    user,
    root,
    error
}