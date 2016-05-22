import rp from 'request-promise'
import { Observable } from 'rx'

const sendActivityToCoreService = (activities$, requestLib=rp) => {
  return activities$
  .flatMap(activity => {
    const performRequest = requestLib({
      method: 'POST',
      uri: process.env.CORE_ACTIVITY_API_ENDPOINT || 'https://velocitas-core.herokuapp.com/api/commutes/activities',
      body: activity.toJSON,
      json: true
    })
    return Observable.fromPromise(performRequest)
    .catch(e => {
      console.error(`Error performing HTTP request: ${e}`);
      return Observable.just('error');
    })
    .tap(v => console.log(`Performed HTTP request. Response: ${v}`))
    .map(_ => activity)
  });
};

export default sendActivityToCoreService;
