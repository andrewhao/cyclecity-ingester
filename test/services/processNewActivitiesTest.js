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
    const mockStrava = {
      activityZipped: () => {
        return new Promise((res, rej) => res([]))
      }
    }
    let input = Observable.just(first)
    let expectedOutput = [ { activityId: 124 } ];
    processNewActivities(input, mockStrava)
    .catch(err => console.log(err))
    .subscribe(output => {
      expect(output[0].activityId).to.eql(124);
      done();
    })
  });
});
