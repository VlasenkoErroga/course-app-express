if( process.env.NODE_ENV === 'production'){
    module.exports = require('./variable.prod')
} else {
    module.exports = require('./variable.dev')
}