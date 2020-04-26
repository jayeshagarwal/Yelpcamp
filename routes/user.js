const express = require("express")
const router = express.Router()
const User = require("../models/user");
const passport = require("passport");

router.get("/", (req,res)=> {
    res.render("landing");
})

// display form to sign up a user
router.get('/register', (req,res)=> {
    res.render("register")
})

// signup a user and then logging them in
router.post('/register', async (req,res)=> {
    try {
        const newUser = new User({username: req.body.username})
        const user = await User.register(newUser, req.body.password) 
        passport.authenticate('local')(req, res, ()=> {
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect('/campgrounds')
        })  
    }
    catch(e)
    {
        //res.send(e)
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

// display login form
router.get("/login", (req,res)=> {
    res.render('login')
})

// authenticating user
router.post("/login", passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
    successFlash: "Welcome to YelpCamp"
}), (req,res)=> {})

// log out user
router.get('/logout', (req,res)=> {
    req.logout();
    req.flash("success", "Logged you Out!")
    res.redirect("/campgrounds")
})

module.exports = router