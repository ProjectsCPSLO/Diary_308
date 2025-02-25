import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  signupUser,
  loginUser,
  getProfile,
  getCollaborators,
  addCollaborator,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.get('/profile', requireAuth, getProfile);
router.get('/collaborators', requireAuth, getCollaborators);
router.post('/add-collaborator', requireAuth, addCollaborator);

export default router;
