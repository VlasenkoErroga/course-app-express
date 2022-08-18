const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
    courses: [{
        course: {
            type: Object,
            required: true
        },
        counter: {
            type:Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        require:true
    },
    orderNumber: {
        type: Number,
        require: true,
        default: 1
    },
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    },
    date: {type:Date, default: Date.now}
})

module.exports = model('Order', orderSchema)