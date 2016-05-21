import mongoose, { Schema } from 'mongoose';

const activitySchema = Schema({
  importedAt: { type: Date },
  activityId: { type: Number, index: { unique: true } },
  raw: Object,
  name: String,
  type: String,
  activity: Object,
  stream: Array,
  commute: Boolean,
  timestamps: Date,
});

export default mongoose.model('Activity', activitySchema);
