import express from 'express';
import { verifyAdmin } from '../utils/verifyToken.js';
import {
  createTransport,
  updateTransport,
  deleteTransport,
} from '../controllers/transportController.js';

const router = express.Router();

// Create a new transport option (Admin Only)
router.post('/', verifyAdmin, createTransport);

// Update a transport option (Admin Only)
router.put('/:id', verifyAdmin, updateTransport);

// Delete a transport option (Admin Only)
router.delete('/:id', verifyAdmin, deleteTransport);

export default router;
