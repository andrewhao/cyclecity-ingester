import { dbReady } from  '../helper';
import { expect } from 'chai';
import { Observable } from 'rx';
import sinon from 'sinon';
import Promise from 'bluebird';
import sendActivityToCoreService from '../../services/sendActivityToCoreService';
import Activity from '../../models/Activity';

describe('sendActivityToCoreService()', () => {
  beforeEach((done) => Activity.remove({}).then(() => done()))

  it('sends a POST request', function(done) {
    const httpRequestPerformed = sinon.spy()
    const mockRequestLib = function() {
      return Promise.resolve().then(() => {
        httpRequestPerformed()
      });
    };

    const activityJSON = {
      activity: {},
      stream: [],
    };
    const activity = new Activity(activityJSON);
    const activities$ = Observable.just(activity);

    sendActivityToCoreService(activities$, mockRequestLib)
    .subscribe(output => {
      expect(output).to.eq(activity)
      expect(httpRequestPerformed.called).to.eq(true)
      done();
    });
  });
});
