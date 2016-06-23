import { expect } from 'chai';
import sinon from 'sinon';
import StravaService from '../../services/strava';

describe('StravaService', () => {
  const activity1 = {
    type: 'Ride'
  };
  const activity2 = {
    type: 'Run'
  };
  const accessToken = 'abcdefg';

  const listActivities = (data, cb) => {
    expect(data.access_token).to.eql(accessToken)
    cb(null, [activity1, activity2]);
  };
  const mockStrava = {
    athlete: {
      listActivities
    }
  };

  const subject = new StravaService();

  describe('activities()', () => {
    it('returns a list of activities', (done) => {
      subject.activities(accessToken, mockStrava)
      .then(output => {
        expect(output).to.eql([activity1, activity2]);
        done()
      })
    });
  });
});
