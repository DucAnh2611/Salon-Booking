const { verifyEmailOTP, sendOTPEmail, login, signup } = require("../../models/user");
const { jwtAuth } = require("../../services/jwt");

const AuthRouter = require("express").Router();

AuthRouter.get("/test", jwtAuth, (req, res) => {
    res.json({msg: "ok"});
})

AuthRouter.post("/login", async (req, res) => {
    const result = await login(req.body);

    res.status(result.status).json(result);
});

AuthRouter.post("signup", async (req, res) => {
    const result = await signup(req.body);

    res.status(result.status).json(result);
})

AuthRouter.post("/email-otp", async (req, res) => {
    const {uid, email} = req.body;
    const result = await sendOTPEmail({uid, email});

    res.status(result.status).json(result);
});

AuthRouter.post("/email-otp-verify", async (req, res) => {
    const result = await verifyEmailOTP(req.body)

    res.status(result.status).json(result);
})

module.exports = AuthRouter;