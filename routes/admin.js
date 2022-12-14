const {Router} = require('express')
const router = Router()
const models = require('../models/index.js')
const middlewere = require('../middlewere/index.js')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

router.get('/', middlewere.root, async (req, res, next) => {
    const allUsers = await models
        .User
        .find()
    const slider = await models
        .SliderMain
        .find()
    const courses = await models
        .Course
        .find()
    res.render('admin', {
        title: 'Admin panel',
        isAdmin: true,
        slider,
        allUsers,
        courses,
        error: req.flash('error')
    })
})

router.post('/slider/add', middlewere.root, async (req, res, next) => {

    try {
        console.log(req.body)
        const slide = await new models.SliderMain({
            title: req.body.title,
            subtitle: req.body.subtitle,
            url: req.body.url,
            background: req.body.background,
            file: {
                data: fs
                    .readFileSync(
                        path.join(__dirname, '..', 'img', 'slider', req.file.filename)
                    )
                    .toString('base64'),
                contentType: req.file.mimetype,
                fullname: req.file.fullname
            }
        })

        await slide.save()
        res.redirect('/admin#slider')
        req.flash('error', 'Slide was added.')

    } catch (error) {
        res
            .status(500)
            .redirect('/admin')
        console.log(error)
    }
})

router.post('/slider/remove', middlewere.root, async (req, res, next) => {

    try {
        await models
            .SliderMain
            .deleteOne({_id: req.body.id})

        res.redirect('/admin#slider')
        req.flash('error', 'Slide was deleted.')
    } catch (error) {
        console.log(error)
    }

})




router.delete('/course/remove/:id', middlewere.root, async (req, res, next) => {
        try {

            res.header({loaded: true})
            await models
                .Course
                .deleteOne({_id: req.params.id})

            const courses = await models
                .Course
                .find()

            res.header({loaded: false})
            res
                .status(200)
                .json(courses)
                req.flash('error', 'Course was deleted.')
        } catch (error) {
            console.log(error)
        }
    }
)

router.post('/course/add', middlewere.root, async (req, res, next) => {

    try {
        
        const course = await new models.Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            file: {
                data: fs
                    .readFileSync(
                        path.join(__dirname, '..', 'img', 'courses', req.file.filename)
                    )
                    .toString('base64'),
                contentType: req.file.mimetype,
                fullname: req.file.fullname
            },
            short_description: req.body.short_description,
            userId: req
                .user
                ._id
                .toString()
        })

        await course.save()
        res.redirect('/admin#courses')
        req.flash('error', 'Course was added.')

    } catch (error) {
        console.log(error)
    }

})

router.get('/course/edit/:id', middlewere.root, async (req, res, next) => {
    try {

        const courseEdit = await models
            .Course
            .find({_id: req.params.id})

        res.send(courseEdit)
        req.flash('error', 'Course was edited.')
    } catch (error) {
        console.log(error)
    }
})





router.post('/user/add', middlewere.root, async (req, res, next) => {
    try {
        const {email, password, confirm, name, role} = req.body

        const candidate = await models
            .User
            .findOne({email})

        if (candidate) {
            req.flash('error', 'User with this e-mail was exist')
            res.redirect('/admin#users')
        } else {

            const areSamePass = password === confirm
                ? true
                : false
            if (areSamePass) {

                const toChange = {
                    avatar: {}
                }

                if (req.file) {
                    toChange.avatar = {
                        data: fs
                            .readFileSync(
                                path.join(__dirname, '..', 'img', 'profile', req.file.filename)
                            )
                            .toString('base64'),
                        contentType: req.file.mimetype,
                        fullname: req.file.fullname
                    }
                }

                const hashPassword = await bcrypt.hash(password, 10)
                const user = new models.User({
                    email,
                    name,
                    password: hashPassword,
                    role,
                    basket: {
                        items: []
                    }
                })

                Object.assign(user, toChange)
                await user.save()
                req.flash('error', 'User successfully created.')

                res.redirect('/admin#users')

            } else {
                req.flash('error', 'Passwords do not match')
                res.redirect('/admin#users')
            }

        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/user/edit/:id', middlewere.root, async (req, res, next) => {
    try {
        const userEdit = await models
            .User
            .find({_id: req.params.id})

        res.send(userEdit)
        req.flash('error', 'User was edited.')
    } catch (error) {
        console.log(error)
    }
})

router.post('/user/update', middlewere.root, async (req, res, next) => {

    try {

        const { password, confirm} = req.body

    const areSamePass = password === confirm ? true : false

    if(areSamePass){
        const user = await models.User.findById(req.body._id)

        const toChange = {
            ...req.body,
        }

    if(req.body.password){
        toChange.password = await bcrypt.hash(req.body.password, 10)
    }

    if(req.file){
        toChange.avatar = {
            data: fs.readFileSync(path.join(__dirname, '..', 'img', 'profile', req.file.filename)).toString('base64'),
            contentType: req.file.mimetype,
            fullname: req.file.fullname
        }
    }

    Object.assign(user, toChange)
    await user.save()
    res.redirect('/admin#users')
    req.flash('error', 'User was edited.')
    } else {
        req.flash('error', 'Passwords do not match')
        res.redirect('/admin#users')
    }

    
    } catch (error) {
        console.log(error)
    }
    

    

})

router.delete('/user/remove/:id', middlewere.root, async (req, res, next) => {
    try {
        await models
            .User
            .deleteOne({_id: req.params.id})

        const allUsers = await models
            .User
            .find()

        res
            .status(200)
            .json(allUsers)

            req.flash('error', 'User was deleted.')
            
    } catch (error) {
        console.log(error)
    }
})

module.exports = router