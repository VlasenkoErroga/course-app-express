const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const variable = require('../var')
const fs = require('fs')
const path = require('path')


// These id's and secrets should come from .env file.
const CLIENT_ID = variable.GC_CLIENT_ID;
const CLEINT_SECRET = variable.GC_SECRET_KEY;
const REFRESH_TOKEN = variable.GC_REFRESH_TOKEN;
const REDIRECT_URI = variable.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(req, order) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: variable.GC_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: variable.GC_EMAIL,
      to: req.user.email, 
      subject: `New order ${order.orderNumber}`,
      text: 'text',
      html: `<header>Welcome! We grearing that. New order ${order._id}</header>
      <body>  
      <table class="highlight responsive-table">
        <thead>
          <tr>
              <th>Name</th>
              <th>Count</th>
              <th>Price</th>
              <th>Edit</th>
          </tr>
        </thead>

        <tbody>
        ${order.courses.map(item => {
            return ` 
            <tr>
              <td>${item.course.title}</td>
              <td>${item.counter}</td>
              <td>${item.course.price}</td>
            </tr>`
            })}
        </tbody>
      </table>
      <p ><strong>Total price: </strong><span >${order.totalPrice} USD</span></p>

      </body>
      <footer>${order.date}</footer>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}



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

        await sendMail(req, order)
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));



        await order.save()

        await req
            .user
            .clearBasket()

        res.redirect('/orders')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router