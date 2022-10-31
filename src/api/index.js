import axios from "axios";

const BASE_URL = 'https://habitica.com/api/v3/';

export const ENDPIONTS = {
    GROUPS: 'groups',
}

export const createAPIEndpoint = endpoint => {
    const AUTHOR_ID = "cd538cb3-47fe-4eb5-8cb7-f263384e4008";
    const USER_ID = "cd538cb3-47fe-4eb5-8cb7-f263384e4008";
    const API_TOKEN = "607d8e2e-bbd9-4de0-a24e-fbf657f44253";
    let url = BASE_URL + endpoint + '/';
    return {
        // Generic URL
        getMembers: groupId => axios.get(`${url}${groupId}/members`, {
          headers: {
            'x-client' : AUTHOR_ID,
            'x-api-user' : USER_ID,
            'x-api-key' : API_TOKEN,
          }
        }),
        fetchAll: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        fetchBySearch: info => axios.get(`${url}search/${info}?info=${info}`),
        fetchByLast: () => axios.get(url + 'last/'),
        create: newRecord => axios.post(url, newRecord),
        update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
        delete: id => axios.delete(url + id),
    }
}