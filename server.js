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
  constructor(obj) {
    this.date = obj.datetime;
    this.description = 'Low of ' + obj.low_temp + ', High of ' + obj.high_temp +  ' with ' + obj.weather.description.toLowerCase();
  }
}

app.get("/weather", (req, res) => {
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?days=3&lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}`;
  axios.get(url).then(res => {
    const weatherArray = res.data.data.map(
      (forecast) => new Forecast(forecast)
    );
    console.log.forEach(weatherArray)
    response.send(weatherArray);
  });
});
//err handling

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
