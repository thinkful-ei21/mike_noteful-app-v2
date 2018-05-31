'use strict';

// require express
const express = require('express');

// require knex
const knex = require('../knex');

// create router instance
const router = express.Router();

// GET all folders
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


// GET a single item by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .first()
    .where('id', id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// PUT update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// POST (insert) an item
router.post('/', (req, res, next) => {
  const { name } = req.body;

  const newItem = { name };
  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert(newItem)
    .debug(true)
    .returning(['id', 'name'])
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/folders/${item.id}`).status(201).json(item);
      }
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .where('id', id)
    .del()
    .debug(true)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;