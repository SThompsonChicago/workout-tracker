const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require("path");

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const db = require('./models/index');

const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/Database1',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/exercise', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/exercise.html'))
);

app.get('/stats', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/stats.html'))
);

app.get('/api/workouts', (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        }
    ])

        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

app.put('/api/workouts/:id', ({ body, params }, res) => {
    db.Workout.findByIdAndUpdate(
        params.id,
        {
            $push: { exercises: body }
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

app.post('/api/workouts', ({ body }, res) => {
    db.Workout.create(body)
        .then(dbWorkout => {
            res.status(200).json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

app.get('/api/workouts/range', (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        }
    ])
        .sort({ _id: -1 })
        .limit(7)
        .sort({ _id: 1 })
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});



app.listen(PORT, () => {
    console.log(`Workout Tracker running on port ${PORT}`);
});