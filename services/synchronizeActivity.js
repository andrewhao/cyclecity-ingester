import Activity from '../models/Activity';
import { Observable } from 'rx';
import { inspect } from 'util';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(activities$, strava) {
  return activities$
  .tap(v => console.log('synchronizeActivity', v))
  .flatMap(result => result)
  .concatMap(activity => Observable.just(activity).delay(5000))
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
