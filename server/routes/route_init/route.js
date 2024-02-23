const InitRouter = require("express").Router();

InitRouter.get("/", (req, res) => res.json({status: "ok"}));


module.exports = InitRouter;