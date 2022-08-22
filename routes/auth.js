const {Router} = require('express')
const router = Router()
const models = require('../models/index')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const variable = require('../var')
const { sendEmail, resetPassword } = require('../emails')

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

router.get('/reset', (req, res, next) => {
    res.render('auth/reset', {
        title: 'Reset pasword',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res, next) => {

    try {
        crypto.randomBytes(32, async (error, buffer)=> {
            if( error ){
                req.flash('error', 'Somesing went wrong')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await models.User.findOne({email: req.body.email})

            if(candidate){
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() +  60 * 60 * 4 * 1000
                await candidate.save()

                await sendEmail(resetPassword(variable, candidate.email, token))
                .catch((error) => console.log(error.message));

                res.redirect('/auth/login')

            } else {
                req.flash('error', 'This email is not exsist.')
                return res.redirect('/auth/reset')
            }
        })

        
    } catch (error) {
        console.log(error)
    }
})

router.get('/password/:token', async (req, res, next) => {
    try {
        if(!req.params.token){
            res.redirect('/auth/login')
        }
    
        const user = await models.User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        

        if(!user){
            res.redirect('/auth/login#login')
        } else {
            res.render('auth/restore', {
                title: 'Restore access',
                userId: user._id.toString(),
                token: req.params.token,
                error: req.flash('error')
            })
        } 

    } catch (error) {
        console.log(error)
    }

   
})

router.post('/password', async (req, res, next) => {


    try {
        const user = await models.User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined

            user.save()
            res.redirect('/auth/login')

        } else {
            req.flash('error', 'Time existing token ending. Please try again.')
            res.redirect('/auth/login')
        }
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router