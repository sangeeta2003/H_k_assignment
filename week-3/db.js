const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";


mongoose.connect("your_mongo_url", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Connected to MongoDB"))
.catch(err => console.log(" MongoDB connection error:", err));

const UserProfileSchema = mongoose.model("User", {
  name: String,
  username: { type: String, unique: true },
  password: String,
});

const app = express();
app.use(express.json());


async function userExists(username, password) {
  try {
    const data = await UserProfileSchema.findOne({ username: username, password: password });
    return data ? true : false;
  } catch (err) {
    console.error(err);
    return false;
  }
}


app.post('/signup', async function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  try {
    // check if username already exists
    const existing = await UserProfileSchema.findOne({ username });
    if (existing) {
      return res.status(403).json({ msg: "User already exists, please signin" });
    }

    const userDetails = new UserProfileSchema({
      name: name,
      username: username,
      password: password
    });

    const doc = await userDetails.save();
    const token = jwt.sign({ username: username }, jwtPassword);

    res.status(201).json({ msg: "Signup successful", token, user: doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error during signup" });
  }
});


app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!(await userExists(username, password))) {
    return res.status(403).json({
      msg: "Incorrect username or password",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({ msg: "Signin successful", token });
});


app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;

    const users = await UserProfileSchema.find({ username: { $ne: username } });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
});

app.listen(3000, () => {
  console.log(" Server is started on port 3000");
});
