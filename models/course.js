const {Schema, model} = require('mongoose')

const courseSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    file: {
        data: Buffer,
        contentType: String,
        encoding: {
            type: String
        },
        fullname: {
            type: String
        },
        originalname: {
            type: String
        }
    },
    short_description: {
        type: String,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

courseSchema.method('toClient', function () {
    const course = this.toObject()

    course.id = course._id
    delete course._id
    return course
})

module.exports = model('Courses', courseSchema)