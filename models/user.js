var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username:String,
    password:String
});

//  add bunch of passport local mongoose methods to userschema
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User',userSchema);

