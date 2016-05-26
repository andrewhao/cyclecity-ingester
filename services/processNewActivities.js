import Promise from 'bluebird';
import { Observable } from 'rx';
import Report from '../models/Report';
import RxNode from 'rx-node';
import { inspect } from 'util';
import StravaService from '../services/strava';
import generateStoplightReportService from '../services/generateStoplightReport';

export default function processNewActivities(savedActivitiesStream, strava, generateStoplightReport=generateStoplightReportService) {
  return savedActivitiesStream
  .tap(v => console.log(`Processing activity ${v.activityId}...`))
  .flatMap(activity => {
    return Observable.fromPromise(
       Report.findOne({ activityId: activity.activityId })
      )
      .zip(Observable.just(activity))
  })
  .flatMap(resultPair => {
    let [queryResult, activity] = resultPair;
    const activityId = activity.activityId;
    console.log(`Creating report for activity ${activityId}...`);
    if (queryResult === null) {
      console.log(`No report found for activity ${activityId}. Generating...`);
      var generateReport = strava.activityZipped(activityId)
      .then(zippedActivity => {
          return generateStoplightReport(activityId, zippedActivity)
      })
      .catch(e => {
        console.error(e);
        return Observable.empty();
      });

      return Observable.fromPromise(generateReport)
      .zip(Observable.just(activity))
    } else {
      console.log(`Report for activity ${activityId} exists. Skipping report generation...`)
      return Observable.empty()
    }
  })
  .tap(([report, activity]) => console.log('generatedStoplight new', activity.activityId))
  .flatMap(resultPair => {
    let [report, activity] = resultPair;
    const activityId = activity.activityId;
    console.log(`Adding new Report for ${activityId}`, report);
    return Observable.fromPromise(
      Report.findOneAndUpdate({
        activityId: activityId,
      }, {
        report: report,
      }, {
        new: true,
        upsert: true
      })
    ).map(report => ({report, activity}));
  })
  .tap(res => console.log(`+ New Report created: ${res.activity.id}`))
};
