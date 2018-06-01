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

router.post('/', (req,res,next) => {
  const { name } = req.body;
  const newTag = { name };
  const originalUrl = `http://${req.headers.host}/notes/${newTag.id}`;

  // validate input
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(newTag)
    .into('tags')
    .debug(true)
    .returning(['id', 'name'])
    .then((results) => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

module.exports = router;