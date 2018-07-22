import mongoose from 'mongoose'
import findOrCreate from 'find-or-create'

const UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  updated_at: { type: Date, default: Date.now },
})

UserSchema.statics.findOrCreate = findOrCreate

export default mongoose.model('User', UserSchema)
