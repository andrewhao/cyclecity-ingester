import Activity from '../models/Activity';
import { Observable } from 'rx';
import { inspect } from 'util';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(activities$, strava) {
  return activities$
  .flatMap(result => result)
  .tap(v => console.log('beepz'))
  .take(1)
  .flatMap(activity => {
    return Observable.fromPromise(
      strava.activityZipped(activity.id)
      .then(stream => {
        return { activity, stream }
      })
    );
  })
  .map((res) => {
    const { activity, stream } = res;
    console.log('stream2', stream[0]);
    return Activity.findOneAndUpdate({
      activityId: activity.id
    }, {
      name: activity.name,
      type: activity.type,
      commute: activity.commute,
      activity: activity,
      stream: stream,
    }, {
      upsert: true,
      new: true
    })
  })
  .flatMap(query => {
    return Observable.fromPromise(query)
  })
  .tap(r => console.log(`Saved Activity: ${inspect(r)}`))
};
