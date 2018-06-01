-- psql -U dev -f ./db/noteful-app.2.sql noteful-app

SELECT current_timestamp;

DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL
); 

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE notes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT current_timestamp,
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

CREATE TABLE tags (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE notes_tags (
  note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);


INSERT INTO folders (name) 
VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');


INSERT INTO notes (title,content,folder_id)
VALUES ('Water Plants','My plants are thisrty',100),
  ('Wash Dishes','My dishes are dirty',null),
  ('Read about SQL','Learning SQL is fun!',103),
  ('Call Mom','Mom called yesterday, I need to call her back',null),
  ('Exercise','You''re out of shape! Go to the Gym',102),
  ('Wash Car','My car is dirty',101),
  ('Brush Teeth','My teeth are dirty. YUK!',101);
  --RETURNING id,title;


INSERT INTO tags (name)
VALUES 
  ('health'),
  ('production'),
  ('correspondance'),
  ('fun stuff');

INSERT INTO notes_tags (note_id, tag_id)
VALUES 
  (1001, 1),
  (1001, 1),
  (1002, 1),(1001, 1),(1001, 1),
  (1003, 3),
  (1004, 2),
  (1005, 1),(1005, 2),(1005, 3),(1005, 4),
  (1006, 1); 

SELECT * FROM notes;
SELECT * FROM folders;
SELECT * FROM tags;

SELECT title, tags.name as tagName, folders.name as folderName FROM notes
JOIN folders ON notes.folder_id = folders.id
JOIN notes_tags ON notes.id = notes_tags.note_id
JOIN tags ON notes_tags.tag_id = tags.id;
