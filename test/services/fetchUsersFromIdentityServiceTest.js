import { dbReady } from  '../helper';
import { expect } from 'chai';
import { Observable } from 'rx';
import sinon from 'sinon';
import Promise from 'bluebird';
import fetchUsersFromIdentityService from '../../services/fetchUsersFromIdentityService';
import Activity from '../../models/Activity';
import Report from '../../models/Report';

describe('fetchUsersFromIdentityService()', () => {
  const httpRequestPerformed = sinon.spy();
  const email = 'andrew@example.com';
  const stravaAccessToken = 'abcdefg';

  it('returns a list of users from the GET', function(done) {
    const mockRequestLib = function() {
      return Promise.resolve().then(() => {
        httpRequestPerformed();
        return { users: [{ email, strava_access_token: stravaAccessToken }] };
      });
    };

    fetchUsersFromIdentityService(mockRequestLib)
    .toArray()
    .subscribe(output => {
      expect(output[0].strava_access_token).to.eq(stravaAccessToken)
      expect(output[0].email).to.eq(email)
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

    fetchUsersFromIdentityService(mockRequestLib)
    .toArray()
    .subscribe(output => {
      expect(output).to.eql([])
      done();
    });
  });
});
