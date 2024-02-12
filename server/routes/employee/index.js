const EmpRouter = require("express").Router();

EmpRouter.get("/hello", (req, res) => {
    res.json({msg: "hello"});
});

module.exports = EmpRouter;