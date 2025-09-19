const express = require('express');
const jwt = require('jsonwebtoken');
const jwtPassword = "123456";
const port = 3000;

const app = express();
app.use(express.json());

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userExists(username, password) {
  return ALL_USERS.some((user) => user.username === username && user.password === password);
}

function usernameExists(username) {
  return ALL_USERS.some((user) => user.username === username);
}

function generateToken(username) {
  return jwt.sign({ username }, jwtPassword, { expiresIn: "1h" });
}

// Signup
app.post("/signup", (req, res) => {
  const { username, password, name } = req.body;

  if (usernameExists(username)) {
    return res.status(403).json({ msg: "User already exists. Please sign in." });
  }

  ALL_USERS.push({ username, password, name });
  const token = generateToken(username);
  res.status(201).json({ token });
});

// Signin
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!userExists(username, password)) {
    return res.status(403).json({ msg: "Incorrect username or password" });
  }

  const token = generateToken(username);
  res.status(200).json({ token });
});

// Protected users list
app.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;

    return res.status(200).json(
      ALL_USERS.filter((user) => user.username !== username)
    );
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Server error" });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
