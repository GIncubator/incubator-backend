import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  userId: String,
  email: {
    type: String,
    unique: true,
  },
  updated_at: { type: Date, default: Date.now },
})

export default mongoose.model('User', UserSchema)
