const passport = require("passport");
const { ENV, redirect_uri } = require("../loaders/configLoader");
const { signup } = require("../models/user");
const defaultFailureRedirect = `${redirect_uri[ENV]}`;

require("dotenv").config();
const DEFAULT_PASS_USER = (id) => process.env.DEFAULT_PASSWORD.replace("id", id);

class PassportOAuth {
    constructor() {}

    static verifyFunction(accessToken, refreshtoken, profile, done) {
        console.log(profile);
        const user = JSON.parse(JSON.stringify(profile._json));
        user.password = DEFAULT_PASS_USER(user.id);

        done(null, profile);
        //signup
    }

    static authenticate(option) {
        return (req, res, next) => {
            const { provider, ...options } = option;
            const { redirect_url, hash } = req.query;
            const state = ( redirect_url || hash ) 
            ? new Buffer.from(JSON.stringify({ redirect_url, hash })).toString("base64") : undefined;
            
            const authenticator = passport.authenticate(provider, {
                ...options,
                state
            });

            authenticator(req, res, next);
        }
    }

    static callBack({provider, failureRedirect = `/`}) {
        return [
            (req, res, next) => passport.authenticate(provider, { failureRedirect: `${defaultFailureRedirect}${failureRedirect}` })(req, res, next),
            async (req, res, next) => {
                // if(req.isAuthenticated()) {
                    const { state } = req.query;
                    const { redirect_url, hash } = JSON.parse(new Buffer.from(state, 'base64').toString());

                    return res.redirect(redirect_url);
                // }
            }
        ];
    }
}

module.exports = PassportOAuth;