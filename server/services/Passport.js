const passport = require("passport");
const { ENV, redirect_uri } = require("../loaders/configLoader");
const { login } = require("../routes/auth/service");
const { generateToken } = require("./jwt");
const { setCookies } = require("./cookies");
require("dotenv").config();

const defaultFailureRedirect = `${redirect_uri[ENV]}`;
const DEFAULT_PASS_USER = (id) => process.env.DEFAULT_PASSWORD.replace("id", id);

const OAUTH_CONFIG = {
    ROLE_CLIENT: {
        id: 1,
        type: "CLIENT"
    }
} 

class PassportOAuth {
    constructor() {}

    static async verifyFunction(req, accessToken, refreshtoken, profile, done) {
        const user = {
            ...JSON.parse(JSON.stringify(profile._json)),
            password: DEFAULT_PASS_USER(profile.id),
            roleid: OAUTH_CONFIG.ROLE_CLIENT.id
        };

        let responseSignup = await login({
                email: user.email,
                password: user.password
            }, 
            user
        );

        req.isLogin = responseSignup;

        done(null, responseSignup);
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
                    const { body } = req.isLogin;
                    const { state } = req.query;
                    const { redirect_url, hash } = JSON.parse(new Buffer.from(state, 'base64').toString());

                    await setCookies({
                        res: res, 
                        data: generateToken(body) 
                    });

                    return res.redirect(redirect_url);
                // }
            }
        ];
    }
}

module.exports = PassportOAuth;