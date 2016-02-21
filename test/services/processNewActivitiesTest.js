import { dbReady } from  '../helper';
import { expect } from 'chai';
import { Observable } from 'rx';
import Promise from 'bluebird';
import processNewActivities from '../../services/processNewActivities';
import Report from '../../models/Report';

describe('processNewActivities()', () => {
  beforeEach((done) => Report.remove({}).then(() => done()))

  it('takes activities from the source stream and detects dupes', (done) => {
    const first = {
      activityId: 124
    };
    const streamFirst = {
      time: 0,
      latlng: [34.015053,-118.490601],
      velocity: 0,
      distance: 0,
    };
    const mockStrava = {
      activityZipped: () => {
        return new Promise((res, rej) => res([streamFirst, streamFirst]))
      }
    }
    let input = Observable.just(first)
    let expectedOutput = [ { elapsedTime: 0, lon: -118.490601, lat: 34.015053, velocity: 0 } ];
    processNewActivities(input, mockStrava)
    .catch(err => console.log(err))
    .subscribe(output => {
      expect(output[0].activityId).to.eql(124);
      expect(output[0].report).to.eql(expectedOutput);
      done();
    })
  });
});
