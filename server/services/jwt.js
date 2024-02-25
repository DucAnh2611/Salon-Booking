const jwt = require("jsonwebtoken");
const ResponseFormat = require("./responseFormat");
require("dotenv").config();
const jsonRes = new ResponseFormat();

const JWT_CONFIG = {
  cookies_name: process.env.COOKIES_NAME,
  jwt_token: process.env.JWT_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_JWT_TOKEN_KEY,
  refresh_token_secret: process.env.REFRESH_JWT_TOKEN_KEY,
  access_token_expire: {
    time: 7,
    type: "d"
  },
  refresh_token_expire: {
    time: 5,
    type: "d"
  }
}

const newToken = (decoded, key, expire = "1d") => {
  return jwt.sign(
    decoded, 
    key,
    {
      expiresIn: expire
    }
  );
}

const generateToken = (payload) => {
  return {
      access_token: newToken(
        payload, 
        JWT_CONFIG.access_token_secret, 
        `${JWT_CONFIG.access_token_expire.time}${JWT_CONFIG.access_token_expire.type}` 
      ),
      refresh_token: newToken(
        payload, 
        JWT_CONFIG.refresh_token_secret, 
        `${JWT_CONFIG.refresh_token_expire.time}${JWT_CONFIG.refresh_token_expire.type}` 
      )
  }
};

const isTokenExpire = (token) => token.exp <= new Date()/1000;

const decodeToken = (nonDecoded, key) => {
  return jwt.verify(nonDecoded, key);
}

function verifyToken(req, res, next) {
  jsonRes.resetState();

  try {

    const token = req.cookies[JWT_CONFIG.cookies_name] || {};
    
    if (!token) {
      jsonRes
        .setSuccess(false)
        .setStatus(403)
        .setMessage("A token is required for authentication")
        .setBody();

      return res.status(jsonRes.status).json(jsonRes);
    }
    let { access_token, refresh_token } = token;

    let decoded = {
      access_token : decodeToken(access_token, JWT_CONFIG.access_token_secret),
      refresh_token: decodeToken(refresh_token, JWT_CONFIG.refresh_token_secret)
    }

    if( isTokenExpire(decoded.refresh_token) ) {
      return res.status(403).json({
        status: "fail", 
        message: "Refresh token expired!"
      });
    }
    else if( isTokenExpire(decoded.access_token) ) {
      decoded = generateToken({
        access_token: decoded.access_token,
        refresh_token: decoded.refresh_token
      })
    }
    else {
      req.user = {
        ...decoded
      };
    }

  } catch (err) {
    console.log(err);
    return res.status(401).json({status: "fail", message: "Invalid Token"});
  }

  return next();
};

module.exports = {
  jwtAuth: verifyToken,
  generateToken
};