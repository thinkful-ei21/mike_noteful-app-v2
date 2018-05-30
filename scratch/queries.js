'use strict';

const knex = require('../knex');

// let searchTerm = 'Water';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });
/* 
let noteId = 4;
knex('notes')
  .select()
  .where('id', `${noteId}`)
  .then(results => {
    console.log(JSON.stringify(results[0], null, 2));
  })
  .catch(err => {
    console.error(err);
  });
 */

let updatedNoteId = 3;
let updatedObj = {
  title: 'Another note about nothing', 
  content: 'This is Another note about nothing'
};
knex('notes')
  .where('id', updatedNoteId)
  .update(updatedObj)
  .returning(['title', 'content'])
  .then(results => {
    console.log(JSON.stringify(results[0], null, 2));
  })
  .catch(err => {
    console.error(err);
  });

