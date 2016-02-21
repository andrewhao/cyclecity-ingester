import mongoose, { Schema } from 'mongoose';

const reportSchema = Schema({
  activityId: { type: Number, index: { unique: true } },
  stops: Array,
  timestamps: Date,
});

export default mongoose.model('Report', reportSchema);
