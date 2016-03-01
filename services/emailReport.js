import sendgridAPI from 'sendgrid';
import { Observable } from 'rx';

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
  .map(report => {
    const emailContents = Object.assign({}, defaultEmail, { text: text(report) });
    const email = new sendgrid.Email(emailContents)
    const sendEmail = Observable.fromNodeCallback(sendgridService.send);
    console.log(sendEmail)
    return sendEmail(email).zip(Observable.just(report))
  })
  .tap(v => console.log(v))
  //.map(resultPair => {
  //  const [json, report] = resultPair;
  //  return {json, report}
  //});
};
