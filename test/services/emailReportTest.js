import emailReport from '../../services/emailReport';
import { expect } from 'chai';
import { Observable } from 'rx';

describe('emailReport()', () => {
  it.only('sends mail to specified recipients', (done) => {
    const report = { id: 1 }
    const input = Observable.just(report);
    const stubSendgrid = {
      send: (config, cb) => {
        const response = {
          message: 'sent'
        }
        cb(null, response);
      }
    }

    emailReport(input, stubSendgrid)
    .catch(e => console.log(e))
    .subscribe(mailResult => {
      console.log(mailResult)
      //expect(mailResult.json).to.eql({ reportId: 1 });
      //expect(mailResult.report).to.eql(report);
      done()
    });
  });
});
