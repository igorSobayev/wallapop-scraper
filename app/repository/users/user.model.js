import mongoose from 'mongoose'

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  surname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,

  conditionsCheck: Boolean,

  creationDate: Date,

  forgotPasswordCode: String,

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

export default mongoose.model('User', User)
