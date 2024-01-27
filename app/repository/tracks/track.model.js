import mongoose from 'mongoose'

const Track = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  tag: {
    type: String,
  },
  platform: {
    type: String,
  },
  link: {
    type: String,
  },
  updateDate: {
    type: Date,
  },
  creationDate: {
    type: Date,
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

  archived: {
    type: Boolean,
    default: false,
  },
  archivedDate: {
    type: Date
  },
  archivedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

  deletedFromPlatform: {
    type: Boolean,
    default: false,
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

export default mongoose.model('Track', Track)
