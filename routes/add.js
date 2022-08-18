const {Router} = require('express')
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')
const fs = require('fs')
const path = require('path')
const router = Router()


    router.get('/',  (req, res, next) => {
        res.render('add', {
            title: 'Add new course',
            isAdd: true,
        })
    })


router.post('/', middlewere.auth, async (req, res, next) => {

    
    
    try {

        const course = await new models.Course({
            title: req.body.title,
            price:req.body.price,
            img: req.body.img,
            file: {
                data: fs.readFileSync(path.join(__dirname, '..', 'img', 'courses', req.file.filename)).toString('base64'),
                contentType: req.file.mimetype,
                fullname: req.file.filename
            },
            short_description: req.body.short_description,
            userId: req.user._id.toString()
        })

        await course.save()

        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router