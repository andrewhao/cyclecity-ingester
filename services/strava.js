import strava from 'strava-v3';
import util from 'util';
import Promise from 'bluebird';

export default class StravaService {
  activities() {
    return new Promise((resolve, reject) => {
      strava.athlete.listActivities({}, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }
  streams() {
    return this.activities()
    .then((pay) => {
      const activity = pay[0]
      return new Promise((resolve, reject) => {
        const stream = strava.streams.activity({
          id: activity.id,
          types: 'latlng,time,velocity_smooth',
          resolution: 'high'
        }, (err, data) => {
          if (!err) { resolve(data); }
          else { reject(err) }
        });
      });
    })
    .catch((err) => console.log(err));
  }
};
