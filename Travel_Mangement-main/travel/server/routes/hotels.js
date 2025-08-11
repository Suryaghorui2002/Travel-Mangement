import express from 'express';

import { getHotel } from '../controllers/Hotel.js';
import Location from '../models/Location.js';

const router = express.Router();



router.get('/find/:id', getHotel);

router.get('/', async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};
    
    const hotels = await Location.find(query)
      .populate('hotels');
    
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;