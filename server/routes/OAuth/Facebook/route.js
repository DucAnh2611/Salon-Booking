const express = require('express');
const passport = require("passport");
const FacebookRouter = express.Router();

FacebookRouter.get(
    '/',
    passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    })
)

FacebookRouter.get(
    '/callback', 
    passport.authenticate('facebook')
)


module.exports = FacebookRouter;
