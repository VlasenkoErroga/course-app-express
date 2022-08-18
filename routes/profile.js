const {Router} = require('express')
const middlewere = require('../middlewere/index.js')
const models = require('../models')
const fs = require('fs')
const path = require('path')
const {paginationFn} = require('../utils')

const router = Router()

router.get('/',middlewere.auth, async (req, res, next) => {

    const coursesCount = await models.Course.find({userId: {$in: req.user._id}}).count();

    const {page, size } = req.query

    const pagination = paginationFn(page , size, coursesCount, req)

    const courses = await models.Course.find({userId: {$in: req.user._id}}).limit(pagination.limit).skip(pagination.skip);

    res.render('profile', {
        title: 'User profile',
        isProfile: true,
        user: req.user.toObject(),
        courses,
        pagination
        
    })
})

router.post('/', middlewere.auth, async (req, res, next ) => {

    try {

        const user = await models.User.findById(req.user._id)

        const toChange = {
            name: req.body.name,
            limit: req.body.limit
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
        res.redirect('/profile')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
