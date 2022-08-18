const {Router} = require('express')
const models = require('../models/index.js')
const xml = require('xml')
const router = Router()

router.get('/', (req, res, next) => {
    res.render('xml', {
        title: 'Aboute CursesApp',
    })
})

router.post('/', async (req, res, next) => {
    try {
        res.set('Content-Type', 'text/xml');
        let xmlContent = []
        const courses = await models.Course.find()

        const props = [ 'title', 'price', 'img','short_description'] 

       await courses.map(course => {

            for (let key of Object.keys(course._doc)) {
                if(props.includes(key)){
                    xmlContent.push({key: 1}) 
                }
            }

        })

        console.log(xmlContent)

        res.send(xml(xmlContent))
    } catch (error) {
        console.log(error)
    }
})

module.exports = router