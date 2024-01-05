const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

const port  = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.status(200).json({message : "Listening"});
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});