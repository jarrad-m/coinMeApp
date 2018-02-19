var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    date        : String,
    coin        : String,
    entryRating : Number,
    exitRating  : Number,
    comments    : String,
    userId      : String
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Trades', userSchema);