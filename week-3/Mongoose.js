// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ---------- MongoDB connection ----------
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/course-selling";
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("Mongo connection error:", err);
  process.exit(1);
});

// ---------- Schemas & Models ----------
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const Admin = mongoose.model('Admin', adminSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  purchasedCourseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const User = mongoose.model('User', userSchema);

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: { type: Boolean, default: false }
});
const Course = mongoose.model('Course', courseSchema);

// ---------- Helpers (header-based auth) ----------
async function authenticateAdmin(req) {
  const username = req.headers.username;
  const password = req.headers.password;
  if (!username || !password) return null;
  const admin = await Admin.findOne({ username, password }).exec();
  return admin || null;
}

async function authenticateUser(req) {
  const username = req.headers.username;
  const password = req.headers.password;
  if (!username || !password) return null;
  const user = await User.findOne({ username, password }).exec();
  return user || null;
}

// ---------- Admin routes ----------
// POST /admin/signup
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  try {
    const existing = await Admin.findOne({ username }).exec();
    if (existing) return res.status(403).json({ message: 'Admin already exists' });

    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /admin/courses
app.post('/admin/courses', async (req, res) => {
  try {
    const admin = await authenticateAdmin(req);
    if (!admin) return res.status(403).json({ message: 'Unauthorized' });

    const { title, description, price, imageLink, published = false } = req.body;
    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: 'title, description and price are required' });
    }

    const course = new Course({ title, description, price, imageLink, published });
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /admin/courses
app.get('/admin/courses', async (req, res) => {
  try {
    const admin = await authenticateAdmin(req);
    if (!admin) return res.status(403).json({ message: 'Unauthorized' });

    const courses = await Course.find().lean().exec();
    // transform to expected shape (id instead of _id)
    const out = courses.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      imageLink: c.imageLink,
      published: c.published
    }));
    res.json({ courses: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- User routes ----------
// POST /users/signup
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  try {
    const existing = await User.findOne({ username }).exec();
    if (existing) return res.status(403).json({ message: 'User already exists' });

    const user = new User({ username, password, purchasedCourseIds: [] });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /users/courses  (list published courses for users)
app.get('/users/courses', async (req, res) => {
  try {
    const user = await authenticateUser(req);
    if (!user) return res.status(403).json({ message: 'Unauthorized' });

    // Usually users only see published courses
    const courses = await Course.find({ published: true }).lean().exec();
    const out = courses.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      imageLink: c.imageLink,
      published: c.published
    }));
    res.json({ courses: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /users/courses/:courseId  (purchase)
app.post('/users/courses/:courseId', async (req, res) => {
  try {
    const user = await authenticateUser(req);
    if (!user) return res.status(403).json({ message: 'Unauthorized' });

    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).exec();
    if (!course || !course.published) {
      return res.status(404).json({ message: 'Course not found or not available' });
    }

    // If already purchased, do nothing (or you can return message)
    const already = user.purchasedCourseIds.find(id => id.equals(course._id));
    if (!already) {
      user.purchasedCourseIds.push(course._id);
      await user.save();
    }

    res.json({ message: 'Course purchased successfully' });
  } catch (err) {
    console.error(err);
    // handle invalid ObjectId
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /users/purchasedCourses
app.get('/users/purchasedCourses', async (req, res) => {
  try {
    const user = await authenticateUser(req);
    if (!user) return res.status(403).json({ message: 'Unauthorized' });

    // populate purchased courses
    await user.populate('purchasedCourseIds').execPopulate?.(); // for compatibility
    const purchased = await Course.find({ _id: { $in: user.purchasedCourseIds } }).lean().exec();

    const out = purchased.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description,
      price: c.price,
      imageLink: c.imageLink,
      published: c.published
    }));

    res.json({ purchasedCourses: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- Catch-all 404 ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
