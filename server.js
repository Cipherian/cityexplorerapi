"use strict";

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const movies = require('./modules/movies');
const { response } = require("express");
const getForecast = require("./modules/weather");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get("/", (request, response) => {
  response.send("testing");
});

app.get("/weather", getWeather);
app.get("/movies", getMovies);

function getWeather(request, response) {
  const { lat, lon } = request.query;
   getForecast(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

function getMovies(request, response) {
  const cityMovie = request.query.cityMovie;
  movies(cityMovie)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
