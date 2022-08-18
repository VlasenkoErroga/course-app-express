const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')

function mapFavoriteItems(favorite) {
    return favorite
        .items
        .map(c => {
            if (c.courseId) {
                return ({
                    ...c.courseId._doc,
                    id: c.courseId.id
                })
            }
        })
}

router.post('/add', middlewere.auth, async (req, res, next) => {
    const course = await models
        .Course
        .findById(req.body.id)
    await req
        .user
        .addToFavorite(course)
    res.redirect('back')
})

router.get('/', middlewere.auth, async (req, res, next) => {

    const user = await req
        .user
        .populate('favorite.items.courseId')

    const favoriteCourse = mapFavoriteItems(user.favorite)
    res.render('favorite', {
        title: 'Favorite',
        isFavorite: true,
        courses: favoriteCourse
    })
})

router.delete('/remove/:id', middlewere.auth, async (req, res, next) => {
    await req
        .user
        .removeFromFavorite(req.params.id)
    const user = await req
        .user
        .populate('favorite.items.courseId')
    const courses = mapFavoriteItems(user.favorite)
    res
        .status(200)
        .json(courses)
})

module.exports = router