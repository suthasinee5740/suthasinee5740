import { config } from './Config/option.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

import giveAwaynewCustomer from './FunctionTest/authen.js';
import homes from './FunctionTest/home.js';
import mission from './FunctionTest/mission.js';
import coupon from './FunctionTest/Coupon.js';
import popup from './FunctionTest/popUp.js';
import promotion from './FunctionTest/promotion.js';
import search from './FunctionTest/search.js';
import tracking from './FunctionTest/Tracking.js';
import cart from './FunctionTest/cart.js';
import notification from './FunctionTest/notification.js'
import privilege from './FunctionTest/privilege.js'


// Define constant variables
const test_mode = __ENV.TEST_MODE || 'smoke';  // smoke, load, stress, soak
const base_url = config.base_url; // base_url of the site defined in config
const stages = config[test_mode].stages; // defining stages used in options

export let options = { stages };


// Each VU collects its own results
export default function main() {

    giveAwaynewCustomer();


}
// export function handleSummary(data) {
//     return {
//         'Testreport_GivenewCustomer.html': htmlReport(data),
// //         'responses.json': JSON.stringify(apiResponses, null, 2), // Save API responses to a JSON file
//     };
// }


// //TEST_MODE=smoke k6 run --out influxdb=http://k6user:k6password@localhost:8086/mydb Check.js