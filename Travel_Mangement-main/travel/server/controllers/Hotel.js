import Hotel from '../models/hotel.js';
import Location from '../models/Location.js';

// Create a new hotel
export const createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();

    if (req.body.location) {
      await Location.findByIdAndUpdate(req.body.location, {
        $push: { hotels: savedHotel._id },
      });
    }

    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating hotel', error });
  }
};

// Update a hotel
export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hotel', error });
  }
};

// Delete a hotel
export const deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hotel', error });
  }
};

// Get a single hotel by ID
export const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotel', error });
  }
};

// Get all hotels (with optional filtering by location)
export const getHotels = async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};

    const hotels = await Location.find(query).populate('hotels');

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hotels', error });
  }
};
