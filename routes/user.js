const express = require("express")
const router = express.Router()
const User = require("../models/user");
const passport = require("passport");

router.get("/", (req,res)=> {
    res.render("landing");
})

router.get('/register', (req,res)=> {
    res.render("register")
})

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

router.get("/login", (req,res)=> {
    res.render('login')
})

router.post("/login", passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
    successFlash: "Welcome to YelpCamp"
}), (req,res)=> {})

router.get('/logout', (req,res)=> {
    req.logout();
    req.flash("success", "Logged you Out!")
    res.redirect("/campgrounds")
})

module.exports = router