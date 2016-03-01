import { dbReady } from  '../helper';
import { expect } from 'chai';
import { Observable } from 'rx';
import Promise from 'bluebird';
import processNewActivities from '../../services/processNewActivities';
import Report from '../../models/Report';

describe('processNewActivities()', () => {
  beforeEach((done) => Report.remove({}).then(() => done()))

  const first = { activityId: 1 };
  const second = { activityId: 2 };

  const event1 = {
    time: 0,
    latlng: [34.015053,-118.490601],
    velocity: 0,
    distance: 0,
  };

  const event2 = {
    time: 0,
    latlng: [34.015053,-118.490601],
    velocity: 0,
    distance: 0,
  };

  const mockStrava = {
    activityZipped: (activityId) => {
      const out = (activityId === 1) ? [ event1, event1 ] : [ event2, event2 ]
      console.log(out);
      return new Promise((res, rej) => res(out))
    }
  }

  it('takes activities from the source stream and saves a stoplight report', (done) => {
    let input = Observable.just(first)
    let expectedOutput = [
      { elapsedTime: 0,
        lon: -118.490601,
        lat: 34.015053,
        velocity: 0 }
    ];

    processNewActivities(input, mockStrava)
    .toArray()
    .subscribe(output => {
      expect(output.length).to.eq(1);
      expect(output[0].activityId).to.eq(1);
      expect(output[0].report).to.eql(expectedOutput);
      done();
    })
  });

  it('does not output anything when the report already exists.', (done) => {
    new Report({ activityId: first.activityId })
    .save()
    .then((report) => {
      const input = Observable.just(first)
      processNewActivities(input, mockStrava)
      .toArray()
      .subscribe(v => {
        expect(v.length).to.eq(0)
        done();
      });
    })
  });

  it('processes multiple reports', (done) => {
    let input = Observable.fromArray([first, second])
    let expectedOutput = [
      { elapsedTime: 0,
        lon: -118.490601,
        lat: 34.015053,
        velocity: 0 }
    ];

    processNewActivities(input, mockStrava)
    .toArray()
    .subscribe(output => {
      expect(output.length).to.eq(2);
      expect(output[0].activityId).to.eq(1);
      expect(output[0].report).to.eql(expectedOutput);
      expect(output[1].activityId).to.eq(2);
      done();
    })
  });
});
