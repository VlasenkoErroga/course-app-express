const {Schema, model} = require('mongoose')

const shemaSlideMain = new Schema({
    title:{
        type: String,
        require: true
    },
    subtitle:{
        type: String,
        require: true
    },
    url:{
        type: String,
        default: null,
        require: true
    },
    file:{
        data: Buffer,
        contentType: String,
        encoding: String,
        fullname: String,
        originalname: String
    },
    background: {
        type: String
    }
})


module.exports = model('SliderMain', shemaSlideMain)