// app/routes.js
var mongoose = require('mongoose');

module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/guide', function(req, res) {
        res.render('guide.ejs');       
    });

   
    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        // find all trades made by logged in User
        mongoose.model('Trades').find({ 'userId' : req.user._id }, function (err, docs) {
            if (err) {
                  res.send("There was a problem" +  err);   
            }
            else {
                var trades = docs;
                res.render('profile.ejs', {
                    user : req.user, // get the user out of session and pass to template
                    trades : trades,
                    errorString: req.query.error,
                    successString: req.query.success
                });
            }
        });
        
    });

    // Add new trade
    app.post('/new', isLoggedIn, function(req, res) {
        
        mongoose.model('Trades').create(
            {   userId          : req.body.userid,            
                date            : req.body.date,
                coin            : req.body.coin.toUpperCase(),
                entryRating     : req.body.entryRating,
                exitRating      : req.body.exitRating,
                comments        : req.body.comments }
        , function (err, trade) {
              if (err) {
                    ///res.send("There was a problem adding the information to the database.");
                    var errorString = encodeURIComponent("There was a problem adding the information to the database.");
                    res.redirect('/?error=' + errorString);
              } else {
                  //Trade has been added
                  console.log('POST updating trades list: ' + trade);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        //res.location("blobs");
                        // And forward to success page
                        var successString = encodeURIComponent("New trade added")
                        res.redirect("/profile/?success=" + successString);
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(profile);
                    }
                });
              }
        })

    });

    // Update trade values
    app.post('/update', isLoggedIn, function(req, res) {
        
        
        mongoose.model('Trades').update( 
            { _id: req.body.tradeId }, 
            { $set :
                {      
                    userId          : req.body.userid ,            
                    date            : req.body.date,
                    coin            : req.body.coin.toUpperCase(),
                    entryRating     : req.body.entryRating,
                    exitRating      : req.body.exitRating,
                    comments        : req.body.comments
                }
            }
        , function (err, trade) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Trade has been added
                  console.log('POST updating trades list: ' + trade);
                  res.format({
                      //HTML response will set the location and redirect back to the profile page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("/profile");
                        // And forward to success page
                        var successString = encodeURIComponent("Trade details successfully updated!")
                        res.redirect("/profile/?success=" + successString);
                    },
                    //JSON response will show the update trade
                    json: function(){
                        res.json(profile);
                    }
                });
              }
        })

    });

    // Route to view single trade for editing 
    app.get('/edit/:id/', isLoggedIn, function(req, res) {
        // find trade based on ID

        mongoose.model('Trades').findOne({ '_id' : req.params.id }, function (err, doc) {
            if (err) {
                    // Trade ID not in Database
                    var errorString = encodeURIComponent("There was a problem editing the trade. Ensure all the details are correct");
                    res.redirect('/profile/?error=' + errorString);
            }
            else {
                console.log(doc);
                var trade = doc;
                res.render('edit.ejs', {
                    user : req.user, // get the user out of session and pass to template
                    trade : trade
                });
            }
        });
        
    });


    // Delete trade
    app.get('/delete/:id/', isLoggedIn, function(req, res) {
        // find trade based on ID

        mongoose.model('Trades').remove({ '_id' : req.params.id }, function (err, doc) {
            if (err) {
                    var errorString = encodeURIComponent("There was a problem deleting the trade. Ensure all the details are correct");
                    res.redirect('/profile/?error=' + errorString);  
            }
            else {
                console.log("Item has been removed");
                res.format({
                      //HTML response will set the location and redirect back to the profile page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // And forward to success page
                        var successString = encodeURIComponent("Trade successfully deleted");
                        res.redirect("/profile/?success=" + successString);
                    },
                    //JSON response will show the update trade
                    json: function(){
                        res.json(profile);
                    }
                });
            }
        });
        
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use(function(req, res, next) {
        res.status(404);
        if (req.isAuthenticated()) {
            res.redirect('/profile');
        } else {
            res.render('index.ejs');

        }
        
    });

    // set up 404 page
    app.use(function (err, req, res, next) {
       console.error(err.stack)
       res.status(404).render('edit.ejs')
    });

        

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
