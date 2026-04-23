const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secret");
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
}

function checkTaskAccess(user, task) {
  if (user.role === "admin") return true;
  return task.created_by === user.user_id;
}

module.exports = { auth, checkTaskAccess };
