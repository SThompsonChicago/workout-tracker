const work = require('express').Router();
const Workout = require('../models/Workout');

work.get('/', (req, res) => {
    Workout.find({})
        .sort({ date: -1 })
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

work.put('/:id', ({ body, params }, res) => {
    Workout.findByIdAndUpdate(
        params.id,
        {
            $push: { exercises: body },
            $inc: { totalDuration: body.duration },
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

work.post('/', ({ body }, res) => {
    Workout.create(body)
    .then(dbWorkout => {
        res.status(200).json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err);
    });
});

module.exports = work;