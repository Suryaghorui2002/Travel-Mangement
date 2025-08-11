import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import TouristSpot from '../models/TouristSpot.js';
import { auth, verifyAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ==============================
// 📍 1. Get All Tourist Spots (Optional Location Filter)
// ==============================
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};

    // Fetch all tourist spots and populate location details
    const spots = await TouristSpot.find(query).populate('location', 'name country');

    res.status(200).json(spots);
  } catch (error) {
    console.error('❌ Error fetching tourist spots:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// 🔎 2. Get a Specific Tourist Spot by ID
// ==============================
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tourist spot ID' });
    }

    const spot = await TouristSpot.findById(id).populate('location', 'name country');

    if (!spot) {
      return res.status(404).json({ message: 'Tourist spot not found' });
    }

    res.status(200).json(spot);
  } catch (error) {
    console.error('❌ Error fetching tourist spot:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// ➕ 3. Add a New Tourist Spot (Admin Only)
// ==============================
router.post(
  '/', // <-- Here, the POST route is used for adding a new tourist spot.
  auth,
  verifyAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('image').isURL().withMessage('Valid image URL is required'),
    body('bestTime').optional().trim(),
    body('entryFee').optional().trim(),
    body('duration').optional().trim(),
    [
      body('coordinates.lat')
        .trim()
        .customSanitizer((value) => parseFloat(value))
        .isFloat()
        .withMessage('Latitude must be a valid number'),
      body('coordinates.lng')
        .trim()
        .customSanitizer((value) => parseFloat(value))
        .isFloat()
        .withMessage('Longitude must be a valid number'),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { location, coordinates, ...data } = req.body;

    if (!mongoose.Types.ObjectId.isValid(location)) {
      return res.status(400).json({ message: 'Invalid location ID' });
    }

    try {
      const spot = new TouristSpot({
        ...data,
        location,
        coordinates: {
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng),
        },
      });

      await spot.save();

      const populatedSpot = await TouristSpot.findById(spot._id).populate(
        'location',
        'name country',
      );

      res.status(201).json(populatedSpot);
    } catch (error) {
      console.error('❌ Error creating tourist spot:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
);


// ==============================
// ✏️ 4. Update a Tourist Spot (Admin Only)
// ==============================
// ==============================
// ✏️ 4. Update a Tourist Spot (Admin Only)
// ==============================
// Corrected Route: Use PUT for update
router.put(
  '/:id', // ✅ Use PUT and specify :id to update the spot
  auth,
  verifyAdmin,
  [
    body('name').optional().trim().notEmpty().withMessage('Name is required'),
    body('location').optional().notEmpty().withMessage('Location is required'),
    body('description').optional().trim().notEmpty().withMessage('Description is required'),
    body('image').optional().isURL().withMessage('Valid image URL is required'),
    body('bestTime').optional().trim(),
    body('entryFee').optional().trim(),
    body('duration').optional().trim(),
    [
      body('coordinates.lat')
        .trim()
        .customSanitizer((value) => parseFloat(value))
        .isFloat()
        .withMessage('Latitude must be a valid number'),
      body('coordinates.lng')
        .trim()
        .customSanitizer((value) => parseFloat(value))
        .isFloat()
        .withMessage('Longitude must be a valid number'),
    ],
  ],
  async (req, res) => {
    const { id } = req.params;

    // Validate ID before updating
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tourist spot ID' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('⚠️ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, coordinates, ...data } = req.body;

    // Validate location if provided
    if (location && !mongoose.Types.ObjectId.isValid(location)) {
      return res.status(400).json({ message: 'Invalid location ID' });
    }

    try {
      const updatedSpot = await TouristSpot.findByIdAndUpdate(
        id,
        {
          ...data,
          location,
          coordinates: {
            lat: parseFloat(coordinates?.lat),
            lng: parseFloat(coordinates?.lng),
          },
        },
        { new: true, runValidators: true },
      ).populate('location', 'name country');

      if (!updatedSpot) {
        return res.status(404).json({ message: 'Tourist spot not found' });
      }

      res.status(200).json(updatedSpot);
    } catch (error) {
      console.error('❌ Error updating tourist spot:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

// ==============================
// 🗑️ 5. Delete a Tourist Spot (Admin Only)
// ==============================
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  // Validate tourist spot ID before deletion
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid tourist spot ID' });
  }

  try {
    console.log('🗑️ Deleting tourist spot...');
    const deletedSpot = await TouristSpot.findByIdAndDelete(id);

    if (!deletedSpot) {
      return res.status(404).json({ message: 'Tourist spot not found' });
    }

    res.status(200).json({ message: 'Tourist spot deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting tourist spot:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
