const express = require("express");
const GoogleRouter = require("./Google/route");
const FacebookRouter = require("./Facebook/route");
const OAuthRouter = express.Router();

OAuthRouter.use("/google", GoogleRouter);
// OAuthRouter.use("/facebook", FacebookRouter);

module.exports = OAuthRouter;