import Activity from '../models/Activity';

/**
 * Synchronizes from Strava to our internal Activity db.
 */
export default function synchronizeActivity(stravaService) {
  return stravaService.activities().then((data) => {
    data.forEach((activity) => {
      Activity.findOneAndUpdate({
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
      .then((a) => console.log(`saved: ${a}`))
    });
  })
};
