import mongoose, { Schema } from 'mongoose';

const activitySchema = Schema({
  importedAt: { type: Date },
  activityId: { type: Number, index: { unique: true } },
});

export default mongoose.model('Activity', activitySchema);
