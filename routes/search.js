const {Router, query} = require('express')
const models = require('../models/index.js')
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        if (!req.query.q) {
            res.render('search', {
                title: 'Find course for your self',
                isSearch: true,
                blockquote: 'Be best! We helping you in this.'
            })
        } else {
            const courses = await models
                .Course
                .aggregate([
                    {
                      '$search': {
                          index: 'default',
                          text: {
                            query: `${req.query.q}`,
                            path: 'title'
                          }
                        }
                    }
                  ])
    
            res.render('search', {
                title: `We found according to your request "${req.query.q}"`,
                isSearch: true,
                blockquote: `We found ${courses.length} courses. Good luck!`,
                courses,
                query: req.query.q
            })
        }
    } catch (e) {
        console.log(e)
    }

    

})

module.exports = router