import { errorRate } from './Metrics.js';
import { check } from 'k6';
export const check_error = (endPoint, res, checks) => {
    const result = check(res, checks,
        { endpoint: res.url, status: res.status });

    if (!result) {
        //Log Body
        console.error(endPoint + ' got status ' + res.status, `\n` + 'Body: ' + res.body, `\n` + 'Check Error: ' + result)

        //Log Status
        // console.error(endPoint + ' Status: ' + res.status, `\n` + 'Check Error: ' + result)
        errorRate.add(!result);
        // console.error('Login API check failed:', res.body + endPoint);
        // fail('Login API check failed');
    } else {
        errorRate.add(0);
    }
    return result;

    //Check Status 200
    // if (res.status != 200) {
    //     console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
    // }
};

