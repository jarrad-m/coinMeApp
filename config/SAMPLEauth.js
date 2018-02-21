module.exports = {

    'facebookAuth' : {
        'clientID'		: "YOUR_FB_DEV_CLIENT_ID",
        'clientSecret' 	: "YOUR_FB_DEV_APP_SECRET",
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'emails', 'name'] // For requesting permissions from Facebook API
    }

};


