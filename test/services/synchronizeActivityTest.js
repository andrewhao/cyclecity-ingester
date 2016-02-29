import synchronizeActivity from '../../services/synchronizeActivity';
import { Observable } from 'rx';
import { expect } from 'chai';

describe('synchronizeActivity()', () => {
  it('synchronizes one new strava service activity', (done) => {
    let activityArray = [{
      id: 123,
      name: 'Evening Commute',
      type: 'Ride',
      commute: true,
    }]

    const activities$ = Observable.just(activityArray);
    synchronizeActivity(activities$)
    .subscribe((out) => {
      expect(out.get('activityId')).to.eq(123);
      done();
    });
  });

  it('synchronizes multiple strava service activities', (done) => {
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
