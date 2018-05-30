'use strict';

const knex = require('../knex');


knex('notes')
  .select('id', 'title')
  .then( results => console.log(JSON.stringify(results, null, 2)))
  .catch( err => (console.log(err))
  );


let searchTerm;
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });


// Get Note By Id accepts an ID. It returns the note as an object not an array
let noteId;
knex('notes')
  .select()
  .where('id', `${noteId}`)
  .then(results => {
    console.log(JSON.stringify(results[0], null, 2));
  })
  .catch(err => {
    console.error(err);
  });


 // Update Note By Id accepts an ID and an object with the desired updates. It returns the updated note as an object
/
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
 */
 */
  // Create a Note accepts an object with the note properties and inserts it in the DB. It returns the new note (including the new id) as an object.
/* let newNote = {
  title: 'Yet another new note for my list', 
  content: 'More content more content More content more content'
};
knex('notes')
  .insert(newNote)
  .debug(true)
  .returning(['id', 'title', 'content'])
  .then( results => console.log(JSON.stringify(results, null, 2)))
  .catch( err => (console.log(err))
  );
 */

// Delete Note By Id accepts an ID and deletes the note from the DB.
// let idToDelete = 2;
// knex('notes')
//   .where('id', idToDelete)
//   .del()
//   .debug(true)
//   .then( results => console.log(JSON.stringify(results, null, 2)))
//   .catch( err => (console.log(err))
//   );

