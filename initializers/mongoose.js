import mongoose from 'mongoose';

const url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017'

export const db = mongoose.connect(url).connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongo.'));

