const Campground = require('../models/campground')
const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/index')

router.get('/', async (req,res)=> {
    try {
        const camps = await Campground.find(req.query)
        res.render('campgrounds/campgrounds', {camps})
        //res.send(camps)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.post('/', middleware.isLoggedIn, async (req,res)=> {
    try {
        req.body.author = {
            id: req.user._id,
            username: req.user.username
        }
        const camp = await Campground.create(req.body)
        //res.send(camp)
        res.redirect('/campgrounds')
    }
    catch(e) {
        //res.status(500).send(e)
        req.flash('error', e.message)
        res.redirect('campgrounds/new')
    }
})

router.get('/new', middleware.isLoggedIn, async (req,res)=> {
    res.render("campgrounds/new")
})

router.get('/:id', async (req,res)=> {
    try {
        const camp = await Campground.findById(req.params.id).populate("comments").exec()
        if(!camp)
        {
            return res.redirect("back")        
        }
        //res.send(camp)
        res.render('campgrounds/show', {camp:camp})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.put('/:id', middleware.campgroundOwner, async (req,res)=> {
    // update a specific campground using method override
    try {
        const camp = await Campground.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!camp)
        {
            return res.redirect("back")        
        }
        //res.send(camp)
        res.redirect('/campgrounds/'+camp._id)
    }
    catch(e)
    {
        req.flash('error', e.message)
        res.redirect('/campgrounds'+req.params.id+'/edit')
        //res.status(400).send(e)
    }
})

router.get('/:id/edit', middleware.campgroundOwner, async (req,res)=> {
    // display form to edit campground
    try {
        const camp = await Campground.findById(req.params.id)
        if(!camp)
        {
            return res.redirect("back")        
        }
        res.render('campgrounds/edit', {camp})
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

router.delete('/:id', middleware.campgroundOwner, async (req,res)=> {
    try {
        await Campground.findByIdAndDelete(req.params.id)  
        //res.send() 
        res.redirect('/campgrounds')
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

module.exports = router