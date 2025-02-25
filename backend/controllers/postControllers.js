import mongoose from 'mongoose';
import Post from '../models/Post.js';
import bcrypt from 'bcrypt';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ user_id: req.user._id }, { sharedWith: req.user._id }],
    }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  console.log('\n=== GET POST REQUEST ===');
  const { id } = req.params;
  const { password } = req.query;

  console.log({
    requestId: id,
    attemptedPassword: password,
  });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Post does not exist' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post does not exist' });
    }

    if (post.password) {
      console.log({
        postId: post._id,
        storedHash: post.password,
        attemptingWithPassword: password,
      });

      if (!password) {
        return res.status(403).json({
          error: 'Password required',
          isPasswordProtected: true,
        });
      } // Test both trimmed and untrimmed versions

      const passwordTrimmed = password.trim();
      const passwordUntrimmed = password;

      const resultTrimmed = await bcrypt.compare(
        passwordTrimmed,
        post.password
      );
      const resultUntrimmed = await bcrypt.compare(
        passwordUntrimmed,
        post.password
      );

      console.log({
        trimmedResult: resultTrimmed,
        untrimmedResult: resultUntrimmed,
        passwordLength: password.length,
        trimmedPasswordLength: passwordTrimmed.length,
        hashLength: post.password.length,
      });

      if (!resultTrimmed && !resultUntrimmed) {
        return res.status(403).json({
          error: 'Incorrect password',
          isPasswordProtected: true,
        });
      }
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  const { date, title, content, password, mood, tags } = req.body;
  const user_id = req.user._id;

  console.log('\n=== CREATE POST REQUEST ===');
  console.log(
    'Received password:',
    password ? 'Yes (length: ' + password.length + ')' : 'No'
  );

  try {
    let hashedPassword = null;
    if (password) {
      // Hash password only once here
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      // Verify the hash immediately
      const verifyTest = await bcrypt.compare(password, hashedPassword);
      console.log('Password verification test:', verifyTest);
    }

    // Create post with single hashed password
    const post = await Post.create({
      date: new Date(date),
      title,
      content,
      user_id,
      mood,
      password: hashedPassword,
      tags: tags ? tags : [],
    });

    console.log('Post created with ID:', post._id);
    console.log('Stored password hash:', post.password);
    console.log('Stored tags:', post.tags);

    res.status(200).json(post);
  } catch (err) {
    console.error('Error in createPost:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: 'post does not exist' });

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'post does not exist' });
    const deletedPost = await Post.findOneAndDelete({ _id: id });
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: 'post does not exist' });

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'post does not exist' });
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyPassword = async (req, res) => {
  console.log('\n=== PASSWORD VERIFICATION REQUEST ===');
  const { id } = req.params;
  const { password } = req.body;

  console.log('Post ID:', id);
  console.log('Received password attempt:', password ? 'Yes' : 'No');

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post does not exist' });
    }

    if (!post.password) {
      return res.status(400).json({ error: 'Post is not password protected' });
    }

    console.log('Stored hash:', post.password);
    const isMatch = await bcrypt.compare(password, post.password);
    console.log('Password verification result:', isMatch);

    if (!isMatch) {
      return res.status(403).json({ error: 'Incorrect password' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Error verifying password' });
  }
};

export const sharePost = async (req, res) => {
  const { id } = req.params;
  const { collaboratorIds } = req.body;

  try {
    const post = await Post.findOne({ _id: id, user_id: req.user._id });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Filter out collaborators that are already in sharedWith
    const newCollaborators = collaboratorIds.filter(
      (id) => !post.sharedWith.includes(id)
    );

    if (newCollaborators.length > 0) {
      post.sharedWith = [...post.sharedWith, ...newCollaborators];
      await post.save();
    }

    res.status(200).json({
      message: 'Post shared successfully',
      sharedWith: post.sharedWith,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
