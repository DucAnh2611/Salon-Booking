require("dotenv").config();
const express = require("express");
const loaders = require("./loaders");

const port = parseInt(process.env.PORT || 3001);

async function StartServer() {
    var app = express();

    app = await loaders({expressApp: app});

    app.listen(port, err => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Server is ready on port: ${port}!`);
      });
}

StartServer();

