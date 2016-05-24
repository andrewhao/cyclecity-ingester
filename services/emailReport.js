var Sendgrid = require('sendgrid');
import { Observable } from 'rx';
import { inspect } from 'util';

const sendgridSvc = Sendgrid(process.env.SENDGRID_API_KEY);
export default function emailReport(reports$, sendgridService=sendgridSvc) {
  const defaultEmail = (report) => ({
    to: process.env.SENDGRID_DEFAULT_RECIPIENT,
    from: process.env.SENDGRID_DEFAULT_SENDER,
    subject: `Your Cyclecity report for Activity #${report.activityId} is ready.`,
  });

  function text(report) {
    return JSON.stringify(report)
  }

  return reports$
  .tap(v => console.log(`Sending new report email...`))
  .map(({ report }) => {
    const emailContents = Object.assign({}, defaultEmail(report), { text: text(report) });
    console.log(`Email has contents: ${inspect(emailContents)}`);
    const email = new sendgridService.Email(emailContents)

    const sendEmail = Observable.fromNodeCallback(sendgridService.send, sendgridService)
    return sendEmail(emailContents).zip(Observable.just(report))
    .catch(e => {
      console.error(e.stack);
      return Observable.empty()
    })
    .tap(v => console.log(`sendgrid response: ${inspect(v)}`));
  })
  .flatMap(response => response)
  .tap(v => console.log(`Report email sent: ${inspect(v)}`))
  .map(([emailResponse, report]) => {
    return {
      json: emailResponse,
      report: report,
    }
  });
};
