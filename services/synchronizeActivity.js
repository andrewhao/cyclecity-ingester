import Activity from '../models/Activity';
import { Observable } from 'rx';
import RxNode from 'rx-node';
import util from 'util';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(stravaService) {
  return Observable.fromPromise(stravaService.activities())
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
    .stream()
  })
  .flatMap(activityStream => RxNode.fromStream(activityStream))
  .tap(r => console.log(`saved: ${util.inspect(r)}`))
};
