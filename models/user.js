const {Schema, model} = require('mongoose')

const usreSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type:Boolean,
        required: true,
        default: false
    },
    role:{
        type: String,
        default: 'client',
        required: true,
    },
    basket: {
        items: [
            {
                counter: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Courses',
                    required: true
                }
            }
        ]
    },
    favorite: {
        items: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Courses',
                    required: true
                }
            }
        ]
    },
    visitedCourse: {
        type: Array
    },
    avatar: {
        data: Buffer,
        contentType: String,
        encoding: String,
        fullname: String,
        originalname: String,
    },
    background: {
        data: Buffer,
        contentType: String,
        encoding: String,
        fullname: String,
        originalname: String
    },
    limit: {
        type: Number,
        default: 4
    },
    resetToken: {
        type: String
    },
    resetTokenExp: {
        type: Date
    }
})

usreSchema.methods.addToBasket = function (course) {
    const items = [...this.basket.items]
    const idx = items.findIndex(c => {
        return c
            .courseId
            .toString() === course
            ._id
            .toString()
    })

    if (idx >= 0) {
        items[idx].counter += 1
    } else {
        items.push({courseId: course._id, counter: 1})
    }

    this.basket = {
        items
    }

    return this.save()

}

usreSchema.methods.removeFromBasket = function (id) {
    let items = [...this.basket.items]
    const idx = items.findIndex(c => c.courseId.toString() === id.toString())
    if (items[idx].counter === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].counter--
    }
    this.basket = {
        items
    }

    return this.save()
}

usreSchema.methods.clearBasket = function () {
    this.basket = {
        items: []
    }
    return this.save()
}

usreSchema.methods.addToFavorite = function (course) {
    const items = [...this.favorite.items]
    const idx = items.findIndex(c => {
        return c
            .courseId
            .toString() === course
            ._id
            .toString()
    })

    if (idx >= 0) {
        return
    } else {
        items.push({courseId: course._id})
    }

    this.favorite = {
        items
    }

    return this.save()

}

usreSchema.methods.removeFromFavorite = function (id) {

    let items = [...this.favorite.items]
    const idx = items.findIndex(c => c.courseId.toString() === id.toString())
    if (items[idx]) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } 

    this.favorite = {
        items
    }

    return this.save()
}

usreSchema.methods.clearFavorite = function () {
    this.favorite = {
        items: []
    }
    return this.save()
}

module.exports = model('User', usreSchema)