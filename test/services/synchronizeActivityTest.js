import synchronizeActivity from '../../services/synchronizeActivity';
import { Observable } from 'rx';
import { expect } from 'chai';

describe('synchronizeActivity()', () => {
  xit('synchronizes one new strava service activity', (done) => {
    let activityArray = [{
      id: 122,
      name: 'Marathon',
      type: 'Run',
      commute: false,
     },{
      id: 123,
      name: 'Evening Commute',
      type: 'Ride',
      commute: true,
    }]

    const mockStrava = {
      activityZipped: () => {
        return Promise.resolve({})
      }
    };

    const activities$ = Observable.just(activityArray);
    synchronizeActivity(activities$, mockStrava)
    .subscribe((out) => {
      expect(out.get('activityId')).to.eq(123);
      done();
    });
  });

  xit('synchronizes multiple strava service activities', (done) => {
    let activityArray = [{
      id: 123,
      name: 'Evening Commute',
      type: 'Ride',
      commute: true,
    }, {
      id: 124,
      name: 'Afternoon Commute',
      type: 'Ride',
      commute: true,
    }]

    const activities$ = Observable.just(activityArray);
    synchronizeActivity(activities$)
    .toArray()
    .subscribe((out) => {
      expect(out[0].get('activityId')).to.eq(123);
      expect(out[1].get('activityId')).to.eq(124);
      done();
    });
  });
});
