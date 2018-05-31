SELECT current_timestamp;

 --DROP TABLE IF EXISTS notes;

-- CREATE TABLE notes (
--   id serial PRIMARY KEY,
--   title text NOT NULL,
--   content text,
--   created timestamp DEFAULT current_timestamp,
--   folder_id int REFERENCES folders(id) ON DELETE SET NULL
-- );

-- INSERT INTO notes (title,content)
-- VALUES ('Water Plants','My plants are thisrty'),
--   ('Wash Dishes','My dishes are dirty'),
--   ('Read about SQL','Learning SQL is fun!'),
--   ('Call Mom','Mom called yesterday, I need to call her back'),
--   ('Exercise','You''re out of shape! Go to the Gym') 
--   RETURNING id,title;

-- INSERT INTO notes (title,content,folder_id)
-- VALUES ('Wash Car','My car is dirty',100),
--   ('Brush Teeth','My teeth are dirty. YUK!',101)
--   RETURNING id,title;

SELECT * FROM notes;

-- DROP TABLE IF EXISTS folders;

-- CREATE TABLE folders (
--     id serial PRIMARY KEY,
--     name text NOT NULL
-- ); 

-- ALTER SEQUENCE folders_id_seq RESTART WITH 100;

-- INSERT INTO folders (name) VALUES
--   ('Archive'),
--   ('Drafts'),
--   ('Personal'),
--   ('Work');

SELECT * FROM folders;

-- get all notes with folders
SELECT * FROM notes
INNER JOIN folders ON notes.folder_id = folders.id;

-- get all notes, show folders if they exists otherwise null
SELECT * FROM notes
LEFT JOIN folders ON notes.folder_id = folders.id;

-- get all notes, show folders if they exists otherwise null
SELECT * FROM notes
LEFT JOIN folders ON notes.folder_id = folders.id
WHERE notes.id = 2;
