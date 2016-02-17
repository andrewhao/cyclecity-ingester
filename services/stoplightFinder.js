import Stoplight from 'stoplight';

export function findStoplights(stravaEvents) {
  const s = new Stoplight()
  return s.stopsFromZippedStravaStream(stravaEvents)
};

