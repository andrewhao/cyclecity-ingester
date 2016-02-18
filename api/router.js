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
  Activity.find({})
  .sort({ activityId: 'desc' })
  .then((activities) => res.send(activities))
});

router.post('/synchronization', (req, res, next) => {
  strava.activities().then((data) => {
    data.forEach((activity) => {
      Activity.findOneAndUpdate({
        activityId: activity.id
      }, {
        name: activity.name,
        type: activity.type,
        commute: activity.commute,
        raw: activity
      }, {
        upsert: true,
        new: true
      })
      .then((a) => console.log(`saved: ${a}`))
    });
  })
  .then(() => res.status(202).end());
});

router.get('/activities/:id/stoplights', (req, res, next) => {
  strava.activityZipped(req.params.id).then((zipped) => {
    return findStoplights(zipped)
  })
  .then((stoplights) => {
    res.send(stoplights);
  })
  .catch((err) => res.send(err));
});

router.get('/activities/:id/stream', (req, res, next) => {
  // - Hit Strava API
  // - Query for list of commutes
  // - Save new commutes (id, streamdata) in db
  const id = req.params.id
  strava.activityZipped(id).then((data) => {
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
