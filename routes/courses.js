const {Router} = require('express')
const models = require('../models/index.js')
const router = Router()
const fs = require('fs')
const path = require('path')
const middlewere = require('../middlewere/index.js')
const {paginationFn, breadcrumbsFn} = require('../utils')

function isOwner(course, req) {
    return course
        .userId
        .toString() === req
        .user
        ._id
        .toString()
}

router.get('/', async (req, res, next) => {
    try {
        const courseCount = await models
            .Course
            .find()
            .count()
        
        const {page, size } = req.query

        const pagination = paginationFn(page, size, courseCount, req)
        const courses = await models
            .Course
            .find()
            .limit(pagination.limit)
            .skip(pagination.skip)
            .populate('userId', 'email name')

        res.render('courses', {
            title: 'All courses',
            isCourses: true,
            courses,
            pagination
        })

    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', middlewere.auth, async (req, res, next) => {
    try {
        if (!req.query.allow) {
            return res.redirect('/')
        }

        const course = await models
            .Course
            .findById(req.params.id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit course ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id', async (req, res, next) => {

    try {
        
        const course = await models
            .Course
            .findById(req.params.id)
            if(req.user){
        const user = await models
            .User
            .findById(req.user._id)
            
                const toChange = {
                    visitedCourse: req.user.visitedCourse.length < 4
                        ? [
                            ...[...req.user.visitedCourse],
                            req.params.id
                        ]
                        : [
                            ...req
                                .user
                                .visitedCourse
                                .slice(1),
                            req.params.id
                        ]
                }
        
                Object.assign(user, toChange)
                await user.save()
            }

        

        res.render('course', {
            layout: 'parallax',
            title: `Course ${course.title}`,
            course
        })
    } catch (e) {
        res
            .status(404)
            .redirect('/404')
            console.log(e)
    }
})

router.post('/edit', middlewere.auth, async (req, res) => {

    try {
        const id = req.body.id
        delete req.body.id
        const course = await models
            .Course
            .findById(id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        req.body.file = {
            data: fs
                .readFileSync(
                    path.join(__dirname, '..', 'img', 'courses', req.file.filename)
                )
                .toString('base64'),
            contentType: req.file.mimetype,
            fullname: req.file.fullname
        }

        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', middlewere.auth, async (req, res) => {

    try {

        await models
            .Course
            .deleteOne({_id: req.body.id, userId: req.user._id})
        res.redirect('/courses')
    } catch (error) {
        console.log(e)
    }

})

module.exports = router