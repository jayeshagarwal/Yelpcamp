const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: String,
},{
    timestamps: true
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', userSchema)
module.exports = User