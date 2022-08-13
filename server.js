"use strict";

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const weatherData = require("./weather.json");
const { response } = require("express");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;
app.get("/", (request, response) => {
  response.send("testing");
});

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description =
      "Low of " +
      obj.low_temp +
      ", High of " +
      obj.high_temp +
      " with " +
      obj.weather.description.toLowerCase();
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.vote_average= movie.vote_average;
    this.vote_count = movie.vote_count;
    this.image_url = movie.poster_path;
    this.image_url = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}
app.get("/Weather", getWeather);
app.get("/movies", getMovies);

async function getMovies(req, res, next) {
  const searchQuery = req.query.searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_KEY}&query=${searchQuery}&language=en-US&page=1;`
  console.log(url);
  try {
    const response = await axios.get(url);
    console.log('testing', response.data.results);
    const movieArray = response.data.results.map(movie => new Movie(movie));
    console.log(movieArray);
    res.status(200).send(movieArray);
  } catch (error) {
    console.error(error)
    next(error.message);
  }
}

async function getWeather(req, res, next) {

  const { searchQuery, lat, lon } = req.query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?days=7&units=I&lat=${lat}&lon=${lon}&city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`;
  try {
    const weatherResponse = await axios.get(url);
    const weatherArray = weatherResponse.data.data.map(
      (forecast) => new Forecast(forecast)
    );
    res.send(weatherArray);
  } catch (error) {
    next(error.message);
  }
}

//err handling

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
