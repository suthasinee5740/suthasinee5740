import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';


const CheckTrackingList = new Trend('trend_tracking_list');


export default function tracking() {

        group('tracking_list', function () {
            const body = {
                itemStatus: "ALL",
            };

            const endPoint = '/tracking/getTrackingList';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
            const resJson = JSON.parse(res.body)
            const trackingData = resJson.data

            requestCount.add(1);
            myTrend.add(res.timings.waiting);    

            const checks = {
                [Message.Status200]: (r) => statusHttp(r.status, 200),
                [Message.Message + resJson.message]: (r) => resJson.message == 'success',
            };

            check_error(endPoint, res, checks);
            CheckTrackingList.add(res.timings.duration);

        });

    sleep(1);
}
