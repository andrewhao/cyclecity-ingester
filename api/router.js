import { Router } from 'express';
import StravaService from '../services/strava';
import _ from 'lodash';
import { findStoplights } from '../services/stoplightFinder';
import util from 'util';
import mongoose from 'mongoose';
import Activity from '../models/Activity';

const db = mongoose.connect(process.env.MONGOLAB_URI).connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongo.'));

const strava = new StravaService();
const router = new Router();

router.get('/', (req, res, next) => {
  // Am I up?
  res.send('API up!');
});

router.get('/activities', (req, res, next) => {
  Activity.find({}, (err, activities) => res.send(activities))
});

router.post('/synchronization', (req, res, next) => {
  strava.activities().then((data) => {
    data.forEach((activity) => {
      new Activity({ activityId: activity.id })
      .save()
      .catch((e) => console.log(`err: ${e}`))
      .then((a) => console.log(`saved: ${a}`))
    });
  })
  .then(() => res.status(202).end());
});

router.get('/latestActivityStoplights', (req, res, next) => {
  strava.latestActivityZipped().then((zipped) => {
    return findStoplights(zipped)
  })
  .then((stoplights) => {
    res.send(stoplights);
  })
  .catch((err) => res.send(err));
});

router.get('/stravaStreams', (req, res, next) => {
  // - Hit Strava API
  // - Query for list of commutes
  // - Save new commutes (id, streamdata) in db
  strava.latestActivityZipped().then((data) => {
    res.send(data);
  })
  .catch((err) => res.send(err));
});

router.get('/stravaActivities', (req, res, next) => {
  strava.activities().then((data) => {
    res.send(data);
  });
});

router.get('/ingest', (req, res, next) => {
  // - For commutes without reports
  // - generate report
  // - save report
  console.log("Ingesting...");
});

router.get('/send', (req, res, next) => {
  // - email reports that have not been emailed
});

export default router;
