import { check, group, sleep, fail } from 'k6';
import http from 'k6/http';
import exec from 'k6/execution';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';


import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';


const Check_Popup_Home = new Trend('trend_popup_Home');

export default function popUP() {

    group('popup_Home', function () {
        const endPoint = '/middlewareOpenapp/v2?version=90';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'สำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Popup_Home.add(res.timings.duration);
    });
};
sleep(1);
//}
