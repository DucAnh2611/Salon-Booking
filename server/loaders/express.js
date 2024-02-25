require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require('cookie-parser');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const ClientRouter = require("../routes/client");
const EmpRouter = require("../routes/employee");
const AuthRouter = require("../routes/auth");
const OAuthRouter = require("../routes/OAuth/route");
const passport = require("passport");
const PassportOAuth = require("../services/Passport");
const { host, ENV } = require("./configLoader");
const InitRouter = require("../routes/route_init/route");

module.exports = ({app}) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://salon-booking-client.vercel.app/", "https://salon-booking-employee.vercel.app/"],
    }));
    app.use(compression()); 
    app.use(require('express-session')({ secret: 'salon booking', resave: true, saveUninitialized: true }));
    app.use(cookieParser());
    app.use((req, res, next) => {
        const color = {
            DELETE: "\x1b[31m",
            GET: "\x1b[32m",
            POST: "\x1b[33m",
            PUT: "\x1b[34m",
            TEXT: "\x1b[37m"
        }
        
        console.log(color[req.method.toUpperCase()], req.method.toUpperCase(), color.TEXT, req.url);
        next();
    })
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENTID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${host[ENV]}/${process.env.GOOGLE_AUTH_CALLBACK}`,
                passReqToCallback: true
            },
            (req, accessToken, refreshToken, profile, done) => {
                process.nextTick(() => PassportOAuth.verifyFunction(req, accessToken, refreshToken, profile, done))
            }
        ));

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APPID,
                clientSecret: process.env.FACEEBOOK_SECRET ,
                callbackURL: `${host[ENV]}/${process.env.FACEBOOK_AUTH_CALLBACK}`,
                
                profileFields: ['id', 'emails', 'name']
            },
            (accessToken, refreshToken, profile, done) => {
                process.nextTick(
                    () => PassportOAuth.verifyFunction(accessToken, refreshToken, profile, done)
                );
            }
        ));

    passport.serializeUser((user, cb) => {
        return cb(null, user);
    })

    passport.deserializeUser((obj, cb) => {
        return cb(null, obj);
    });

    app.use("/", InitRouter);
    app.use("/client", ClientRouter);
    app.use("/emp", EmpRouter);
    app.use("/auth", AuthRouter);
    app.use("/oauth", OAuthRouter);

    app.set('trust proxy', 1);

    return app;
}