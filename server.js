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

app.get("/Weather", getWeather);

async function getWeather(req, res, next) {

  const { searchQuery, lat, lon } = req.query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?days=7&units=I&lat=${lat}&lon=${lon}&city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`;

  try {
    const weatherResponse = await axios.get(url);
    const weatherArray = weatherResponse.data.data.map(
      (forecast) => new Forecast(forecast)
    );
    console.log(weatherArray);
    res.send(weatherArray);
  } catch (error) {
    console.error(error)
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
