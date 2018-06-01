'use strict';

// require express
const express = require('express');

// require Router
const router = express.Router();

// require knex
const knex = require('../knex');


// GET all tags
router.get('/', (req,res,next) => {
  knex('tags')
    .select()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req,res,next) => {
  const id = req.params.id;

  knex('tags')
    .first()
    .where('id', id)
    .then(item => {
      if(item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch( err => next(err));
});

module.exports = router;