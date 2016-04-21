import Activity from '../models/Activity';
import { Observable } from 'rx';
import { inspect } from 'util';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(activities$) {
  return activities$
  .flatMap(result => result)
  .map(activity => {
    return Activity.findOneAndUpdate({
      activityId: activity.id
    }, {
      name: activity.name,
      type: activity.type,
      commute: activity.commute,
      raw: activity
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
