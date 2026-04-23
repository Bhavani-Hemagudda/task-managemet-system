const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    password TEXT,
    role TEXT,
    organization_id INTEGER
  )`);

  db.run(`CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title TEXT,
    created_by INTEGER,
    organization_id INTEGER
  )`);

  db.run(`CREATE TABLE logs (
    id INTEGER PRIMARY KEY,
    task_id INTEGER,
    action TEXT,
    user_id INTEGER
  )`);
});

module.exports = db;
