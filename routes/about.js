const {Router} = require('express')
const models = require('../models/index.js')
const router = Router()

router.get('/', (req, res, next) => {
    res.render('about', {
        layout: 'parallax',
        title: 'Aboute CursesApp',
        isAbout: true
    })
})

module.exports = router