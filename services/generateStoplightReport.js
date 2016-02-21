import findStoplights from './findStoplights'

export default function generateStoplightReport(activityId, strava) {
  return strava.activityZipped(activityId)
  .then((zipped) => findStoplights(zipped))
};
