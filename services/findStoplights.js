import Stoplight from 'stoplight';

export default function findStoplights(stravaEvents) {
  const s = new Stoplight()
  return s.stopsFromZippedStravaStream(stravaEvents)
};

