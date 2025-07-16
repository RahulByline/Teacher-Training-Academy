import express from 'express';
import { upload, uploadFiles, getSampleData } from '../controllers/importController.js';
import { authenticateUserOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All import routes require authentication
router.use(authenticateUserOrAdmin);

router.post('/upload', upload.array('files', 10), uploadFiles);
router.get('/sample/:filename', getSampleData);

export default router;