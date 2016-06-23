import { Router } from 'express';
import StravaService from '../services/strava';
import _ from 'lodash';
import util from 'util';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Report from '../models/Report';
import findStoplights from '../services/findStoplights';
import synchronizeActivity from '../services/synchronizeActivity';
import processNewActivities from '../services/processNewActivities';
import sendActivityToCoreService from '../services/sendActivityToCoreService';
import fetchUsersFromIdentityService from '../services/fetchUsersFromIdentityService';
import emailReport from '../services/emailReport';
import Promise from 'bluebird';
import R from 'ramda';
import { Observable } from 'rx';
import { db } from  '../initializers/mongoose';

const strava = new StravaService();
const router = new Router();

router.get('/', (req, res, next) => {
  // Am I up?
  res.send('API up!');
});

router.post('/synchronization', (req, res, next) => {
  return fetchUsersFromIdentityService()
  .concatMap(({ email, strava_access_token }) => {
    return R.pipe(
      R.always(strava_access_token),
      strava.activities,
      Observable.fromPromise,
      R.curry(synchronizeActivity)(R.__, strava_access_token, strava),
      R.curry(processNewActivities)(R.__, strava_access_token, strava),
      sendActivityToCoreService,
      emailReport
    )();
  })
  .toArray()
  .subscribe(
    (report) => res.status(202).send(report),
    (err) => res.status(500).send(err)
  )
});

export default router;
