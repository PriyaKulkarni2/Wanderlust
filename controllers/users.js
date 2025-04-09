const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("listings/signup.ejs");
}

module.exports.signup = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        //req.login() again a passport.js method used to create a session with the user info sent in the parameter here it is registeredUser and also has a callback which we are storing in err

        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust!");
            res.redirect("/listings");
        });
    } catch(er) {
        req.flash("error",er.message);
    }
}

module.exports.renderLoginForm  = (req,res) => {
    res.render("listings/login.ejs");
}

module.exports.login = async(req,res) => {
        
    req.flash("success","welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";

    //here we cannot directly redirect to res.locals.redirectUrl as there is a chance that a user may want to login directly from the navbar. in that case it does not visit the middleware isLoggedIn where req.session.redirecUrl is defined. 
    //this may give us page not found error, so we use "/listings" to redirect in case the variable res.locals.redirectUrl is not defined. means when we login from the navbar.

    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    //req.logout() is a method provided by passport.js which logs out a user. means deletes the info from req.user 
    //it also has a callback that gets stored in err 
    req.logout((err) => { 
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}