const {User} = require('../models/index')
module.exports = async function(req, res, next) {
    if(!req.session.isAuthenticated){
        return res.redirect('/auth/login')
    }

    if(!req.session.user){
        return next()
    }
    
    req.user = await User.findById(req.session.user._id)
    next()
}