const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const DatabasePG = require("./config/db");
const measure = require("./config/timeTracking");
const sendM = require("./config/nodemailer");
require("dotenv").config();

const port  = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const db1 = DatabasePG.getInstance();
const db2 = DatabasePG.getInstance();

app.get('/', async (req, res) => {
    sendM();
}) 

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});