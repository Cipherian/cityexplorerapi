"use strict";

const express = require("express");
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
  constructor(type) {
    const citySearch = weatherData.find(
      (city) => city.city_name.toLowerCase() === type.toLowerCase()
    );
    this.city = citySearch;
  }

  getWeather() {
   return this.city.data.map((day) => {
      return {
        day: day.valid_date,
        description: day.weather.description,
        lat:parseFloat(this.city.lat),
        lon:parseFloat(this.city.lon),
      }
    });
  }
}
app.get("/weather", (req, res, next) => {
  try {
    const { searchQuery, lat, lon } = req.query;
    const cityForecast = new Forecast(searchQuery);
    console.log(cityForecast);
    const cityData = cityForecast.getWeather();
    console.log(cityData);
    res.send(cityData);
  } catch (error) {
    next(error.message);
  }
});

//err handling

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
