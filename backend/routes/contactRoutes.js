import express from 'express';
import { 
  getContactFields,
  getContacts, 
  getContact, 
  createContact, 
  updateContact, 
  deleteContact,
  importContacts
} from '../controllers/contactController.js';
import { authenticateUserOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All contact routes require authentication
router.use(authenticateUserOrAdmin);

router.get('/fields', getContactFields);
router.get('/', getContacts);
router.get('/:id', getContact);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.post('/import', importContacts);

export default router;