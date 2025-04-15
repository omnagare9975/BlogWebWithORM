const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const loadEnv = require('./loadEnv');
const { initDB } = require('./sqldb');

// Step 1: Load env and init DB
loadEnv().then(async (envConfig) => {
  await initDB(envConfig); // Now sequelize is initialized

  // Now we can safely load models and routes
  const BlogModel = require('./Models/BlogModel');
  const UserModel = require('./Models/User');
  const UserRouter = require('./Routes/signupRoute');
  const LoginRoute = require('./Routes/Login');
  const HomeRoute = require('./Routes/HomeRoute');
  const { authMiddleware, authMiddlewareForAddBlog } = require('./Middleware/UserAuth');

  // Express setup
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static('public'));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.set('view engine', 'ejs');
  app.set('views', path.resolve('./views'));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });

  const upload = multer({ storage });

  // Routes
  app.get('/addblog', authMiddlewareForAddBlog, (req, res) => {
    res.render('add-blogs');
  });

  app.post('/addblog', upload.single('coverImage'), async (req, res) => {
    try {
      const { title, content } = req.body;
      const coverImage = req.file ? req.file.filename : null;
      await BlogModel.create({ title, content, coverImage });
      res.redirect('/show/blogs');
    } catch (err) {
      console.error('Error creating blog:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/blog/:id', async (req, res) => {
    try {
      const blog = await BlogModel.findByPk(req.params.id);
      if (!blog) return res.status(404).send('Blog not found');
      res.render('blog-detail', { blog });
    } catch (err) {
      console.error('Error fetching blog:', err);
      res.status(500).send('Error loading blog');
    }
  });

  app.get('/show/blogs', async (req, res) => {
    try {
      const blogs = await BlogModel.findAll();
      res.render('showBlogs', { blogs });
    } catch (err) {
      console.error('Error fetching blogs:', err);
      res.status(500).send('Error loading blogs');
    }
  });

  // User routes
  app.use('/user', UserRouter);
  app.use('/home', authMiddleware, HomeRoute);

  // Home
  app.get('/', (req, res) => res.render('FrontendPage'));

  const PORT = envConfig.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));
});
