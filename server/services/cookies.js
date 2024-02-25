const { caltime } = require("../utils/time");
const { newToken } = require("./jwt");

require("dotenv").config();

const COOKIES_CONFIG = {
    name: process.env.COOKIES_NAME,
    cookie_expire: 10
}

async function setCookies({res, data, ...props}) {
    await res.cookie(
        COOKIES_CONFIG.name, 
        data, 
        {   
            maxAge: caltime(COOKIES_CONFIG.cookie_expire, "d"),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: "none"
        }
    );
    return res;
};

function removeCookies({res, ...props}) {
    res.clearCookie(
        COOKIES_CONFIG.name);
    return res;
};

module.exports = {
    setCookies, removeCookies
}