import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// signup
export const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);

    res.status(200).json({
      email,
      token,
      collaborationCode: user.collaborationCode,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({
      email,
      token,
      collaborationCode: user.collaborationCode,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('collaborators', 'email');

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user's collaborators
export const getCollaborators = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'collaborators',
      'email'
    );

    res.status(200).json(user.collaborators);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add collaborator
export const addCollaborator = async (req, res) => {
  const { collaborationCode } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const collaborator = await user.addCollaborator(collaborationCode);

    res.status(200).json({
      collaborator: {
        _id: collaborator._id,
        email: collaborator.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

// Removes Collaborator 
export const removeCollaborator = async (req, res) => {
  const { collaboratorId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ error: 'Collaborator not found' });
    }
    
    user.collaborators = user.collaborators.filter(
      id => !id.equals(collaboratorId)
    );
    
    await user.save();
    
    res.status(200).json({
      message: 'Collaborator removed successfully',
      collaborators: user.collaborators
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
