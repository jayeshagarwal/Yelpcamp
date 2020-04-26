const Comment = require("../models/comment");
const Campground = require("../models/campground");

middlewareObj = {
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash("error", "You need to be Logged in!")
        res.redirect("/login");
    },
    async commentOwner(req, res, next){
        try {
            if(req.isAuthenticated())
            {
                const comment = await Comment.findById(req.params.commentId)
                if(!comment)
                {
                    return res.redirect("back")
                }
                if(comment.author.id.equals(req.user._id))
                {
                    next()
                }
                else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        }
        catch(e) {
            res.redirect("back")
        }
    },
    async campgroundOwner(req, res, next) {
        try {
            if(req.isAuthenticated())
            {
                const camp = await Campground.findById(req.params.id)
                if(!camp)
                {
                    return res.redirect("back")
                }
                if(camp.author.id.equals(req.user._id))
                {
                    next()
                }
                else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        }
        catch(e) {
            res.redirect("back")
        }
    }
}

module.exports = middlewareObj;