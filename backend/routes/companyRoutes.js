import express from 'express';
import { 
  getCompanies, 
  getCompany, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '../controllers/companyController.js';
import { authenticateUserOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All company routes require authentication
router.use(authenticateUserOrAdmin);

router.get('/', getCompanies);
router.get('/:id', getCompany);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;