import mongoose, { Schema } from 'mongoose';

const reportSchema = Schema({
  activityId: { type: Number, index: { unique: true } },
  report: Array,
  timestamps: Date,
});

export default mongoose.model('Report', reportSchema);
