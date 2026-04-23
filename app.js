const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { auth, checkTaskAccess } = require('./middleware');

const app = express();
app.use(express.json());

// LOGIN (hardcoded user for demo)
app.post('/login', (req, res) => {
  const user = {
    user_id: 1,
    role: "admin",
    organization_id: 1
  };
  const token = jwt.sign(user, "secret");
  res.json({ token });
});

// CREATE TASK
app.post('/tasks', auth, (req, res) => {
  const { title } = req.body;
  db.run(
    `INSERT INTO tasks (title, created_by, organization_id)
     VALUES (?, ?, ?)`,
    [title, req.user.user_id, req.user.organization_id]
  );

  res.send("Task created");
});

// GET TASKS (with org filter)
app.get('/tasks', auth, (req, res) => {
  db.all(
    `SELECT * FROM tasks WHERE organization_id = ?`,
    [req.user.organization_id],
    (err, rows) => res.json(rows)
  );
});

// DELETE TASK
app.delete('/tasks/:id', auth, (req, res) => {
  db.get(`SELECT * FROM tasks WHERE id = ?`, [req.params.id], (err, task) => {
    if (!task) return res.sendStatus(404);

    if (!checkTaskAccess(req.user, task))
      return res.sendStatus(403);

    db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id]);
    res.send("Deleted");
  });
});

app.listen(3000, () => console.log("Running"));
