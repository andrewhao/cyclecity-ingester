import { Router } from 'express';
import StravaService from '../services/strava';
import _ from 'lodash';

const strava = new StravaService();
const router = new Router();

router.get('/', (req, res, next) => {
  // Am I up?
  res.send('API up!');
});

router.get('/streams', (req, res, next) => {
  // - Hit Strava API
  // - Query for list of commutes
  // - Save new commutes (id, streamdata) in db
  strava.streams().then((data) => {
    const timeData = _.find(data, { type: 'time' }).data;
    const latlngData = _.find(data, { type: 'latlng' }).data;
    const distanceData = _.find(data, { type: 'distance' }).data;
    const velocityData = _.find(data, { type: 'velocity_smooth' }).data;
    console.log(timeData);
    const zipped = _.zipWith(timeData,
                             latlngData,
                             distanceData,
                             velocityData,
                             (time, latlng, dist, vel) => {
                               return { time: time,
                                 latlng: latlng,
                                 distance: dist,
                                 velocity: vel }
                             })

    res.send(zipped);
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
});

router.get('/send', (req, res, next) => {
  // - email reports that have not been emailed
});

export default router;
