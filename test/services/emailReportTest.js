import emailReport from '../../services/emailReport';
import { expect } from 'chai';
import { Observable } from 'rx';

describe('emailReport()', () => {
  it('sends mail to specified recipients', (done) => {
    const report = { id: 1 }
    const input = Observable.just(report);
    const emailResponse = {
      message: 'sent'
    }
    const stubSendgrid = {
      send: (config, cb) => {
        cb(null, emailResponse);
      }
    }

    emailReport(input, stubSendgrid)
    .catch(e => console.log(e))
    .subscribe(mailResult => {
      expect(mailResult.report).to.deep.eql(report);
      expect(mailResult.json).to.deep.eql(emailResponse);
      done()
    })
  });
});
