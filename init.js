const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require('moment')
const app = express();
const md5 = require('md5')
const Cryptr = require('cryptr')
const cryptr = new Cryptr("6969696809")

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(6809, () => {
  console.log("Server Running!");
});

module.exports = {
  app
};