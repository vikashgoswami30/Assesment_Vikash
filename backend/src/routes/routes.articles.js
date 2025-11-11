import express from 'express';
const router = express.Router();
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import * as articleController from '../controllers/articleController.js';

// All article routes are protected
router.use(authenticateJWT);

router.post('/', articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', allowRoles('admin'), articleController.deleteArticle);

// Summarize endpoint
router.post('/:id/summarize', articleController.summarizeArticle);

export default router;
