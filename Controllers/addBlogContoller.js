const { BlogModel } = require('../Models/BlogModel'); // ensure this exports correctly

const StoreBlogInfo = async (req, res) => {
  try {
    const { title, content } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    const BlogCreated = await BlogModel.create({
      title,
      content,
      coverImage,
    });

    console.log('Blog Created:', BlogCreated);
    res.redirect('/');
  } catch (err) {
    console.error('Error storing blog:', err);
    res.status(500).send('Server Error');
  }
};

module.exports = StoreBlogInfo;
