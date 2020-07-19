var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy  =  require("passport-local"),
    expressSessions = require("express-session"),
    passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");


mongoose.connect('mongodb://localhost:27018/Auth', {useNewUrlParser: true, useUnifiedTopology: true});


app.use(expressSessions({
    //  encode and decode the information in the sessions using secret
    secret:"lokesh is going to develop web",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

//  encode
passport.serializeUser(User.serializeUser());
//  decode
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.set('view engine','ejs');

// ===============================
app.get('/',function(req,res)
{
    res.render('home')
})

app.get('/secret',isLoggedIn,function (req,res)
{
    res.render('secret');
})

app.get('/login',function (req,res)
{
    res.render('login');``
})

//  middleware runs before the final login
app.post('/login',passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res)
{

});

//  logout functionality
app.get('/logout',function(req,res)
{
//  passport is destroying all user data in the sessions
    req.logout();
    res.redirect('/');
})


function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}

app.get('/register',function (req,res)
{
    res.render('register');
})

app.post('/register',function(req,res)
{
    // res.send('register post route')
    User.register(new User({username:req.body.username}),req.body.password,function(err,user)
    {
     if (err)
     {
         console.log(err);
        return   res.render('register');

     }
    //   below run serilaize user authencticat user
     passport.authenticate("local")(req,res,function()
     {
        res.redirect('/secret');
     })


    });


})

app.get('/logout',function (req,res)
{
    res.render('logout');
})


app.listen(process.env.PORT,process.env.IP,function()
{
    console.log('server started');
})
