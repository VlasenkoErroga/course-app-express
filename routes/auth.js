const {Router} = require('express')
const router = Router()
const models = require('../models/index')
const bcrypt = require('bcryptjs')

router.get('/login', async (req, res, next) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        error: req.flash('error')
    })
})

router.get('/logout', async (req, res, next) => {
    req
        .session
        .destroy(() => {
            res.redirect('/auth/login#login')
        })
})

router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body

        const candidate = await models
            .User
            .findOne({email})

        if (candidate) {
            
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true

                if(req.session.user.role === 'root'){
                    req.session.isRoot = true
                }

                req
                    .session
                    .save(err => {
                        if (err) {
                            throw err
                        }
                        res.redirect('/')
                    })
            } else {
                req.flash('error', 'Invalid password. Please try agen.')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('error', 'User with this e-mail was exist')
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        console.log(err)
    }

})

router.post('/registration', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body

        const candidate = await models
            .User
            .findOne({email})

        if (candidate) {
            req.flash('error', 'User with this e-mail was exist')
            res.redirect('/auth/login#registration')
        } else {

            const areSamePass = password === confirm ? true : false
            if(areSamePass){

                const hashPassword = await bcrypt.hash(password, 10)
                const user = new models.User({
                    email,
                    name,
                    password: hashPassword,
                    basket: {
                        items: []
                    }
                })
                await user.save()
                req.flash('error', 'User successfully created.')

                res.redirect('/auth/login#login')

            } else{
                req.flash('error', 'Passwords do not match')
                res.redirect('/auth/login#registration')
            }

        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = router