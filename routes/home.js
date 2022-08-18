const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')

function mapFavoriteItems(favorite, limit){
    const items = []
    favorite.items.map((c, indx) => {
        if(indx < limit){
            if(c.courseId){
                
                items.push({...c.courseId._doc, id: c.courseId.id})
            }
        }
    })

    return items
}

router.get('/', async (req, res, next) => {
    
    const lastAddedCourses = await models.Course.find().sort({_id:-1}).limit(4);
    const slider = await models.SliderMain.find()
    const sliderButton = {
        title: 'Button',
        url: '/admin'
    }
    let lastVisitedCourses = []
    let lastFavoriteCourses = []
    if(req.user){
        lastVisitedCourses = await models.Course.find({_id: {$in: req.user.visitedCourse}});
        const user = await req.user.populate('favorite.items.courseId')
        lastFavoriteCourses = mapFavoriteItems(user.favorite, req.user.limit)
    }
    

    res.render('index', {
        title: 'CursesApp - develop your brain',
        lastAddedCourses,
        lastVisitedCourses,
        lastFavoriteCourses,
        slider,
        sliderButton,
    })
})

module.exports = router