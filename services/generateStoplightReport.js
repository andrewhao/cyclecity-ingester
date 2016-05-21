import findStoplights from './findStoplights'

export default function generateStoplightReport(activityId, zipped) {
  console.log(`generateStoplightReport for ${activityId}`);
  return findStoplights(zipped)
  .then(result => {
    console.log(`findStoplights from Stoplight framework returned with activity ${activityId}`);
    console.log('findStoplights:', result);
    return result;
  });
};
