"use strict";

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const getMovies = require('./modules/Movies');
const getWeather = require('./modules/Weather')
const notFound = require('./modules/notFound');
const { response } = require("express");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get("/", (request, response) => {
  response.send("testing");
});

app.get("/Weather", getWeather);
app.get("/Movies", getMovies);

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
