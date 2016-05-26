import Activity from '../models/Activity';
import { Observable } from 'rx';
import { inspect } from 'util';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(activities$, strava) {
  return activities$
  .flatMap(result => result)
  .filter(activity => {
    return activity.type === 'Ride';
  })
  .tap(v => console.log('synchronizeActivity', v))
  .concatMap(activity => Observable.just(activity).delay(10000))
  .flatMap(activity => {
    return Observable.fromPromise(
      strava.activityZipped(activity.id)
      .then(stream => {
        return { activity, stream }
      })
    )
    .catch(v => {
      console.error('synchronizeActivity', v, v.stack);
      return Observable.empty();
    })
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
  .tap(r => console.log(`Saved Activity: ${r.activity.id}`))
};
