const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')


function mapBasketItems(basket){
    return basket.items.map(c => {
        if (c.courseId) {
        return ({
        ...c.courseId._doc,
        id: c.courseId.id,
        counter: c.counter
    })}}
    )
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        if(course){
            return total += course.price * course.counter
        }
    }, 0)
}



router.post('/add', middlewere.auth, async (req, res, next) => {

    const course = await models.Course.findById(req.body.id)
    await req.user.addToBasket(course)
    res.redirect('/card')
})

router.get('/', middlewere.auth, async (req, res,next) => {

    const user = await req.user.populate('basket.items.courseId')

    const courses = mapBasketItems(user.basket)
    res.render('card', {
        title: 'Basket',
        isCard: true,
        courses: courses,
        totalPrice: computePrice(courses)
    })
})

router.delete('/remove/:id', middlewere.auth, async (req, res, next) => {
    await req.user.removeFromBasket(req.params.id)
    const user = await req.user.populate('basket.items.courseId')
    const courses = mapBasketItems(user.basket)
    const basket = {
        courses, totalPrice: computePrice(courses)
    }
    res.status(200).json(basket)

})



module.exports = router