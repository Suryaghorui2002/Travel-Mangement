import express from 'express';
import { createHotel, updateHotel, deleteHotel } from '../controllers/Hotel.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Create a new hotel (Admin Only)
router.post('/', verifyAdmin, createHotel);

// Update a hotel (Admin Only)
router.put('/:id', verifyAdmin, updateHotel);

// Delete a hotel (Admin Only)
router.delete('/:id', verifyAdmin, deleteHotel);

export default router;
