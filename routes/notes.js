'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
/* 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
 */

// require knex.js
const knex = require('../knex');

// GET All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;

  knex
    .select('notes.id', 'title', 'content','folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(queryBuilder => {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

// GET a single item by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .select('notes.id', 'title', 'content','folders.id as folderId', 'folders.name as folderName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .first()
    .where('notes.id', id)
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
  const updateableFields = ['title', 'content', 'folderId'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      if(field === 'folderId') {
        updateObj['folder_id'] = req.body[field];
      } else {
        updateObj[field] = req.body[field];
      }
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  let noteId;

  knex('notes')
    .where('id', `${id}`)
    .update(updateObj)
    .returning(['title', 'content', 'folder_id','id'])
    .then(([note]) => {
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', note.id);
    })
    .then(([result]) => {
      res.status(201).json(updateObj);
    })
    .catch(err => {
      next(err);
    });
});


// POST (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;

  const newItem = { title, content, folder_id: folderId};
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const originalUrl = `http://${req.headers.host}/notes/${newItem.id}`;

  let noteId;

  knex('notes')
    .insert(newItem)
    .debug(true)
    .returning('id')
    .then(([id]) => {
      noteId = id;
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })

    .then(newItem => {
      res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(newItem);
    })
    .catch(err => next(err));
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
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
