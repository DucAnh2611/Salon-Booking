require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const ClientRouter = require("../routes/client");
const EmpRouter = require("../routes/employee");
const AuthRouter = require("../routes/auth");
const OAuthRouter = require("../routes/OAuth/route");
const passport = require("passport");
const PassportOAuth = require("../services/Passport");

const ENV = process.env.NODE_ENV || "development";
const redirect_uri = {
    development: {
        client: process.env.URLREEDIRECTCLIENT_DEV,
        employee: process.env.URLREEDIRECTEMPLOYEE_DEV        
    },
    production: {
        client: process.env.URLREEDIRECTCLIENT_PRODUCTION,
        employee: process.env.URLREEDIRECTEMPLOYEE_PRODUCTION        
    }
}

const host = {
    development: process.env.HOST_DEV,
    production: process.env.HOST_PRODUCTION
}

module.exports = ({app}) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://salon-booking-client.vercel.app/", "https://salon-booking-employee.vercel.app/"],
    }));
    app.use(compression()); 
    app.use(require('express-session')({ secret: 'salon booking', resave: true, saveUninitialized: true }));

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENTID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${host[ENV]}:${process.env.PORT}/${process.env.GOOGLE_AUTH_CALLBACK}`
            },
            (accessToken, refreshToken, profile) => PassportOAuth.googleCallback(accessToken, refreshToken, profile)
        ));

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APPID,
                clientSecret: process.env.FACEEBOOK_SECRET ,
                callbackURL: `${host[ENV]}:${process.env.PORT}/${process.env.FACEBOOK_AUTH_CALLBACK}`
            }
            ,
            (accessToken, done, profile) => PassportOAuth.facebookCallBack(accessToken, done, profile)
        ));

    app.use("/client", ClientRouter);
    app.use("/emp", EmpRouter);
    app.use("/auth", AuthRouter);
    app.use("/oauth", OAuthRouter);

    return app
}