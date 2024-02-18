import mongoose from 'mongoose'
import shared from './../../config/shared.js'

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  // Payment provider ID
  customerId: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: shared.ROLES.USER,
  },
  plan: {
    type: String,
    required: true,
    default: shared.PLANS.FREE,
  },
  tracksCounter: { // TODO: update this data
    type: Number,
    default: 0
  },
  trackUpdatePreference: {
    type: String,
    default: shared.PLANS_CONFIG.DAILY,
  },
  lastManualUpdate: {
    type: Date
  },

  conditionsCheck: {
    type: Boolean,
    default: false,
  },

  creationDate: {
    type: Date,
    default: new Date()
  },

  forgotPasswordCode: {
    type: String,
  },

  active: {
    type: Boolean,
    default: false,
  },

  verificationDate: {
    type: Date
  },

  registerCode: {
    type: String,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
  deletedDate: {
    type: Date,
  },
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

export default mongoose.model('User', User)
