import mongoose from 'mongoose';

const TransportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Bus', 'Taxi', 'Train', 'Bike', 'Other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Transport', TransportSchema);
