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

// GET specific tag by id
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

// POST a new tag
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


// PUT (update) an existing tag
router.put('/:id', (req,res,next) => {
  const id = req.params.id;
  const updateObj = {};
  const updateableFields = ['name'];

  // if request body matches expected input
  updateableFields.forEach(field => {
    if(field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  // validate input
  if (!updateObj.name) {
    const err = new Error('missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  // update object
  knex('tags')
    .where('id', id)
    .update(updateObj)
    .debug(true)
    .returning(['name','id'])
    .then(([results]) => {
      if(results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
    
});

// DELETE a tag by id
router.delete('/:id', (req,res,next) => {
  const id = req.params.id;

  knex('tags')
    .where('id', id)
    .del()
    .debug(true)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
});


module.exports = router;