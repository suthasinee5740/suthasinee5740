import Default from './Default.js';

function headers() {
    return {
      'Content-Type': 'application/json',
      'sec-x-api': Default.secXApi,
       Authorization: `Bearer ${Default.accessToken}`,
    };
}
export default headers;