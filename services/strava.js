import stravaLib from 'strava-v3';
import util from 'util';
import Promise from 'bluebird';
import _ from 'lodash';

// I haven't figured this out, but the load order sometimes isn't
// guaranteed and dotenv doesn't always load up.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export default class StravaService {
  activityZipped(activityId, strava = stravaLib) {
    return this.activityStream(activityId, strava)
    .then((data) => {
      console.log(data);
      const timeData = _.find(data, { type: 'time' }).data;
      const latlngData = _.find(data, { type: 'latlng' }).data;
      const distanceData = _.find(data, { type: 'distance' }).data;
      const velocityData = _.find(data, { type: 'velocity_smooth' }).data;
      console.log(`activityZipped with activity ${activityId}`)
      return _.zipWith(timeData,
                       latlngData,
                       distanceData,
                       velocityData,
                       (time, latlng, dist, vel) => {
                         return {
                           time: time,
                           latlng: latlng,
                           distance: dist,
                           velocity: vel
                         };
                       });
    });
  }

  activities(strava = stravaLib) {
    return new Promise((resolve, reject) => {
      strava.athlete.listActivities({ per_page: 200 }, (err, data) => {
        if (!err) { resolve(data); }
        else { reject(err); }
      });
    })
  }

  activityStream(activityId, strava = stravaLib) {
    console.log(`Looking up Strava activity stream for ${activityId}...`);
    return new Promise((resolve, reject) => {
      const stream = strava.streams.activity({
        id: activityId,
        types: 'latlng,time,velocity_smooth',
        resolution: 'high'
      }, (err, data) => {
        if (!err) { resolve(data); }
        else {
          console.error('Error', err)
          reject(err)
        }
      });
    });
  }
};
