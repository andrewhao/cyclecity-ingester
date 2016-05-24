import rp from 'request-promise'
import { Observable } from 'rx'

const sendActivityToCoreService = (activities$, requestLib=rp) => {
  return activities$
  .flatMap(input => {
    let { activity, report } = input;
    const postBody = {
      activity: activity.toJSON(),
      report: report.toJSON(),
    };

    const performRequest = requestLib({
      method: 'POST',
      uri: process.env.CORE_ACTIVITY_API_ENDPOINT || 'https://velocitas-core.herokuapp.com/api/v1/commuting/activities',
      body: postBody,
      json: true
    })

    return Observable.fromPromise(performRequest)
    .catch(e => {
      console.error(`Error performing HTTP request: ${e}`);
      return Observable.just('error');
    })
    .tap(r => console.log(`Performed HTTP request. Response: ${r}`))
    .map(_ => input)
  });
};

export default sendActivityToCoreService;
