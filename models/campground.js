const mongoose = require('mongoose')

const campgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        trim: true,
        validate(value)
        {
            if(!((/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(value)))
            {
                throw new Error('Image should be gif,jpg,tiff,png,webp,bmp')
            }
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    }
},{
    timestamps: true
})

const Campground = mongoose.model('campground', campgroundSchema)
module.exports = Campground