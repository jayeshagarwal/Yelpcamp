const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})