const express = require('express')
const campgroundRoutes = require('./routes/campgrounds')
const commentRoutes = require('./routes/comment')
const userRoutes = require('./routes/user')
const methodOverride = require('method-override')
const passport = require('passport')
const localstrategy = require('passport-local')
const expressSession = require('express-session')
const bodyParser = require("body-parser")
const flash = require('connect-flash')
const User = require('./models/user')
const app = express()
require('./db/mongoose')

app.set("view engine", "ejs")

// getting data in JSON format and send back data into JSON
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride("_method"))
app.use(express.static(__dirname+'/public'))
app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
})

app.use("/", userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

const port = process.env.PORT
app.listen(port, ()=> {
    console.log("server started")
})