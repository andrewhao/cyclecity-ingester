import { dbReady } from  '../helper';
import { expect } from 'chai';
import { Observable } from 'rx';
import sinon from 'sinon';
import Promise from 'bluebird';
import sendActivityToCoreService from '../../services/sendActivityToCoreService';
import Activity from '../../models/Activity';
import Report from '../../models/Report';

describe('sendActivityToCoreService()', () => {
  beforeEach((done) => Activity.remove({}).then(() => done()))

  const httpRequestPerformed = sinon.spy()
  const activityJSON = {
    activity: {},
    stream: [],
  };
  const reportJSON = {
    report: []
  };

  const activity = new Activity(activityJSON);
  const report = new Report(reportJSON);
  const activities$ = Observable.just({ activity, report });

  it('sends a POST request', function(done) {
    const mockRequestLib = function() {
      return Promise.resolve().then(() => {
        httpRequestPerformed()
      });
    };

    sendActivityToCoreService(activities$, mockRequestLib)
    .subscribe(output => {
      expect(output.activity).to.eq(activity)
      expect(output.report).to.eq(report)
      expect(httpRequestPerformed.called).to.eq(true)
      done();
    });
  });

  it('passes through if the http call throws an exception', function(done) {
    const mockRequestLib = function() {
      return Promise.resolve().then(() => {
        throw 'oops'
      });
    };

    sendActivityToCoreService(activities$, mockRequestLib)
    .subscribe(output => {
      expect(output.activity).to.eq(activity)
      expect(httpRequestPerformed.called).to.eq(true)
      done();
    });
  });
});
