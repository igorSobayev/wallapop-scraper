import mongoose from 'mongoose'

const TrackHistory = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  trackId: {
    type: mongoose.Types.ObjectId,
    ref: 'Track',
  },

  // Product info
  title: {
    type: String,
  },
  views: {
    type: Number,
  },
  favs: {
    type: Number,
  },
  price: {
    type: Number,
  },
  delivery: {
    type: Boolean,
    default: false,
  },
  deliveryInfo: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  sold: {
    type: Boolean,
    default: false,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  previewImg: {
    type: String,
  },
  updateDate: {
    type: Date,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
  deletedDate: Date,
  deletedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  } 
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
})

export default mongoose.model('TrackHistory', TrackHistory)
