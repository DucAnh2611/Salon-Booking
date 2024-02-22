const express = require('express');
const passport = require("passport");
const GoogleRouter = express.Router();

GoogleRouter.get(
    '/',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
)

GoogleRouter.get(
    '/callback', 
    passport.authenticate('google')
)


module.exports = GoogleRouter;
