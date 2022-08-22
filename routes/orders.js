const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')
const variable = require('../var')
const { orderEmail, sendEmail } = require('../emails')
// const nodemailer = require('nodemailer');
// const { google } = require("googleapis");
//const path = require('path')





router.get('/', middlewere.auth, async (req, res, next) => {

    try {
        const orders = await models.Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        res.render('orders', {
            title: 'My orders',
            isOrders: true,
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.counter * c.course.price 
                    })
                }
            })
        })
    } catch (e) {
        console.log(e)
    }


})

router.post('/', middlewere.auth, async (req, res, next) => {

    try {

        const user = await req
        .user
        .populate('basket.items.courseId')
       
        let totalPrice = 0
        const courses = user
            .basket
            .items
            .map(c => {

                totalPrice += c.counter * c.courseId._doc.price

                return ({
                    counter: c.counter,
                    course: {
                        ...c.courseId._doc
                    }
                })
            }
            )


        const order = new models.Order({
            user: {
                userId: req.user
            },
            orderNumber: Date.now(),
            totalPrice,
            courses
        })

        
        // in this place calling fn sendmail
        res.redirect('/orders')
        await sendEmail(orderEmail(variable, req.user.email, order))
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));

        await sendEmail(orderEmail(variable, variable.GC_EMAIL, order))
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));

        await order.save()

        await req
            .user
            .clearBasket()

    } catch (e) {
        console.log(e)
    }

})

module.exports = router