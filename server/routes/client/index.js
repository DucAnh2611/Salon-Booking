const DatabasePG = require("../../services/db");

const ClientRouter = require("express").Router();

ClientRouter.get("/", async (req, res) => {
    const db1 = DatabasePG.getInstance();
    const conn = await db1.connect();

    const result = await conn.query("SELECT * FROM users", []);
    console.log(result.rows);

    res.json({message: "Hello Manh This is /client/"});
})

ClientRouter.get("/hello", (req, res) => {
    res.json({message: "Hello"});
})

// ClientRouter.use("/client", ClientRouter);

module.exports = ClientRouter;