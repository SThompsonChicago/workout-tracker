const express = require('express');

const workoutRouter = require('./workouts');

const app = express();

app.use('/workouts', workoutRouter);

module.exports = app;