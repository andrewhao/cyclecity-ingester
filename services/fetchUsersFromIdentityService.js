import rp from 'request-promise'
import { Observable } from 'rx'

const bearerToken = process.env.IDENTITY_API_BEARER_TOKEN;

const fetchUsersFromIdentityService = (requestLib=rp) => {
  const performRequest = requestLib({
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${bearerToken}`,
    },
    uri: process.env.IDENTITY_USERS_API_ENDPOINT || 'http://localhost:4000/api/users',
    json: true
  });

  return Observable.fromPromise(performRequest)
  .catch(e => {
    console.error(`[fetchUsersFromIdentityService] Error performing HTTP request:`, e);
    return Observable.just({ users: [] });
  })
  .tap(r => console.log(`[fetchUsersFromIdentityService] Performed HTTP request. Response: `, r))
  .flatMap(jsonBody => Observable.fromArray(jsonBody['users']));
};

export default fetchUsersFromIdentityService;
