import { db } from '../initializers/mongoose';
import connReady from 'mongoose-connection-ready';
import mongoose from 'mongoose';

const dbReady = connReady(mongoose.connection);

before(done => {
  dbReady
  .then(v => console.log('Test setup complete.'))
  .then(done);
});

