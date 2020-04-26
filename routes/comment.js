const Campground = require('../models/campground')
const Comment = require('../models/comment')
const express = require('express')
const router = express.Router({mergeParams: true})
const middleware = require("../middlewares/index") 

router.post('/', middleware.isLoggedIn, async (req,res)=> {
    // add comment to campground
    try {
        const camp = await Campground.findById(req.params.id)
        if(!camp)
        {
            return res.redirect("back")        
        }
        const comment = await Comment.create(req.body)
        comment.author.id = req.user._id
        comment.author.username = req.user.username
        comment.save()
        camp.comments.push(comment)
        camp.save()
        //res.send(camp)
        res.redirect('/campgrounds/'+req.params.id)
    }
    catch(e)
    {
        //res.status(400).send(e)
        res.redirect('/campgrounds')
    }
})

router.get('/', middleware.isLoggedIn, async (req,res)=> {
    // display form to add comment
    try {
        const camp = await Campground.findById(req.params.id)
        res.render('comments/new', {camp})
    }
    catch(e)
    {
        //res.status(400).send(e)
        res.redirect("back")
    }
})

router.get('/:commentId', middleware.commentOwner, async (req,res)=> {
    // display form to edit comment
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment)
        {
            return res.redirect('back')
        }
        //res.send(comment)
        res.render('comments/edit', {comment, campId: req.params.id})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.put('/:commentId', middleware.commentOwner, async (req,res)=> {
    // edit comment
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true, runValidators: true})
        if(!comment)
        {
            return res.redirect('back')
        }
        //res.send(comment)
        res.redirect('/campgrounds/'+req.params.id)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.delete('/:commentId', middleware.commentOwner, async (req,res)=> {
    try {
        const camp = await Campground.findById(req.params.id)
        if(!camp)
        {
            return res.redirect('back')
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        camp.comments = camp.comments.filter((comment)=> {
            return !(comment.equals(req.params.commentId))
        })
        await camp.save()
        res.redirect('/campgrounds/'+camp._id)
        //res.send(camp)
    }
    catch(e)
    {
        res.redirect('back')
        //res.status(400).send(e)
    }
})

module.exports = router