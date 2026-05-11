import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;
