import { check, group, sleep, fail } from 'k6';

import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';


const Check_mission_All = new Trend('trend_home_mission_All');




export default function mission() {

    group('mission__home_get_allMission', function () {
        const body = {
            set: 1,
        };

        const endPoint = '/mission/home_app_get_all_mission';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)
        const couponList = resJson.data.Coupon

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };


        check_error(endPoint, res, checks);
        Check_mission_All.add(res.timings.duration);

        sleep(1);

    });

    sleep(1);

};
