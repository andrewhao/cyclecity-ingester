import { Router } from 'express';
import StravaService from '../services/strava';
import _ from 'lodash';
import { findStoplights } from '../services/stoplightFinder';
import util from 'util';

const strava = new StravaService();
const router = new Router();

router.get('/', (req, res, next) => {
  // Am I up?
  res.send('API up!');
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

router.get('/streams', (req, res, next) => {
  // - Hit Strava API
  // - Query for list of commutes
  // - Save new commutes (id, streamdata) in db
  strava.latestActivityZipped().then((data) => {
    res.send(data);
  })
  .catch((err) => res.send(err));
});

router.get('/activities', (req, res, next) => {
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
