import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
{

  userId:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },

  location:
  {
    type: String,
    required: true,
  },

  startDate:
  {
    type: Date,
    required: true,
  },

  duration:
  {
    type: Number,
    required: true,
  },

  budget:
  {
    type: String,
    required: true,
  },

  interests:
  {
    type: String,
    required: true,
  },

  travelStyle:
  {
    type: String,
    required: true,
  },

  itineraryContent:
  {
    type: String,
    required: true,
  },
},
{

  timestamps: true,
});

export const Itinerary = mongoose.model('Itinerary', itinerarySchema);
