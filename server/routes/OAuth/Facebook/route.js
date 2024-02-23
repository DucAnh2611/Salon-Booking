const express = require('express');
const PassportOAuth = require('../../../services/Passport');
const FacebookRouter = express.Router();

FacebookRouter.get(
    '',
    PassportOAuth.authenticate({ 
        provider: 'facebook',
        scope: ['public_profile', 'email']
    })
)

FacebookRouter.get(
    '/callback', 
    ...PassportOAuth.callBack({
        provider: 'facebook',
        failureRedirect: "/oauth/facebook"
    })
)


module.exports = FacebookRouter;
