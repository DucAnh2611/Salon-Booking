const express = require('express');
const passport = require("passport");
const PassportOAuth = require('../../../services/Passport');
const GoogleRouter = express.Router();

GoogleRouter.get(
    '',
    PassportOAuth.authenticate({ 
        provider: 'google',
        scope: ['profile', 'email']
    })
)

GoogleRouter.get(
    '/callback', 
    ...PassportOAuth.callBack({
        provider: 'google',
        failureRedirect: "/oauth/google"
    })
)


module.exports = GoogleRouter;
