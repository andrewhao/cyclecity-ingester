import sendgridAPI from 'sendgrid';
import { Observable } from 'rx';
import { inspect } from 'util';

const EMAIL_SUBJECT = 'Your Cyclecity report is ready.'
const sendgrid = sendgridAPI(process.env.SENDGRID_API_KEY)

export default function emailReport(reports$, sendgridService=sendgrid) {
  const defaultEmail = {
    to: process.env.SENDGRID_DEFAULT_RECIPIENT,
    from: process.env.SENDGRID_DEFAULT_SENDER,
    subject: EMAIL_SUBJECT,
  };

  function text(report) {
    return report
  }

  return reports$
  .tap(v => console.log(`Sending new report email...`))
  .map(report => {
    const emailContents = Object.assign({}, defaultEmail, { text: text(report) });
    const email = new sendgrid.Email(emailContents)
    const sendEmail = Observable.fromNodeCallback(sendgridService.send);
    return sendEmail(email).zip(Observable.just(report))
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
