import Transport from '../models/Transport.js';
import Location from '../models/Location.js';

// Create a new transport option
export const createTransport = async (req, res) => {
  try {
    const newTransport = new Transport(req.body);
    const savedTransport = await newTransport.save();

    if (req.body.location) {
      await Location.findByIdAndUpdate(req.body.location, {
        $push: { transports: savedTransport._id },
      });
    }

    res.status(201).json(savedTransport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transport', error });
  }
};

// Update transport details
export const updateTransport = async (req, res) => {
  try {
    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedTransport);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transport', error });
  }
};

// Delete a transport option
export const deleteTransport = async (req, res) => {
  try {
    await Transport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transport', error });
  }
};

// Get a single transport option by ID
export const getTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    res.status(200).json(transport);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transport', error });
  }
};

// Get all transport options (with optional filtering by location)
export const getTransports = async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = locationId ? { location: locationId } : {};

    const transports = await Location.find(query).populate('transports');

    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transports', error });
  }
};
