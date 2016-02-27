import Promise from 'bluebird';
import { Observable } from 'rx';
import Report from '../models/Report';
import RxNode from 'rx-node';
import { inspect } from 'util';
import StravaService from '../services/strava';
import generateStoplightReport from '../services/generateStoplightReport';

export default function processNewActivities(savedActivitiesStream, strava) {
  return savedActivitiesStream
  .tap(v => console.log(`Processing activity ${v.activityId}...`))
  .flatMap(activity => {
    return Observable.fromPromise(
       Report.findOne({ activityId: activity.activityId })
      )
      .zip(Observable.just(activity.activityId))
  })
  .flatMap(resultPair => {
    let [queryResult, activityId] = resultPair;
    if (queryResult === null) {
      return Observable.fromPromise(
        generateStoplightReport(activityId, strava)
      )
      .zip(Observable.just(activityId))
    } else {
      return Observable.empty()
    }
  })
  .flatMap(resultPair => {
    let [report, activityId] = resultPair;
    return Observable.fromPromise(
      Report.findOneAndUpdate({
        activityId: activityId,
      }, {
        report: report,
      }, {
        new: true,
        upsert: true
      })
    )
  })
  .tap(res => console.log(`+ New Report created: ${res}`))
  .toArray()
};