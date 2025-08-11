import express from 'express';
import { body, validationResult } from 'express-validator';
import TouristSpot from '../models/TouristSpot.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};
    
    const spots = await TouristSpot.find(query)
      .populate('location', 'name country');
    
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const spot = await TouristSpot.findById(req.params.id)
      .populate('location', 'name country');
    
    if (!spot) {
      return res.status(404).json({ message: 'Tourist spot not found' });
    }
    
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/',
  auth,
  [
    body('name').trim().notEmpty(),
    body('location').notEmpty(),
    body('description').trim().notEmpty(),
    body('image').isURL(),
    body('bestTime').optional().trim(),
    body('entryFee').optional().trim(),
    body('duration').optional().trim(),
    body('coordinates').optional().isObject()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spot = new TouristSpot(req.body);
      await spot.save();
      
      const populatedSpot = await TouristSpot.findById(spot._id)
        .populate('location', 'name country');
      
      res.status(201).json(populatedSpot);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;