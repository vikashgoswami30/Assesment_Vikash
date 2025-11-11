import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/users', allowRoles('admin'), getAllUsers);

export default router;
