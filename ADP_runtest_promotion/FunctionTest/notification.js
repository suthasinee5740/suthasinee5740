import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';

//Check API
const Check_Noti_RestockPlan = new Trend('trend_noti_restockPlan');
const Check_Noti_RestockPlan_NotRead = new Trend('trend_noti_restockPlan_notRead');
const Check_Noti_Infomation_NotRead = new Trend('trend_noti_infomation_notRead');
const Check_Noti_Mission = new Trend('trend_noti_mission');
const Check_Noti_MissionSuccess = new Trend('trend_noti_missionSuccess');


export default function notification() {

    group('noti_restockPlan', function () {
        const body = {};

        const endPoint = '/notification/restock_plan_sample';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Noti_RestockPlan.add(res.timings.duration);
    });

    group('noti_restockPlan_notRead', function () {

        const endPoint = '/notification/restock_not_read_count';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Noti_RestockPlan_NotRead.add(res.timings.duration);
    });

    group('noti_infomation_notRead', function () {

        const endPoint = '/notification/infomation_not_read_count';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Noti_Infomation_NotRead.add(res.timings.duration);
    });

    group('noti_mission', function () {
        const body = {};

        const endPoint = '/mission/get_onProcess_mission_notiPage';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Noti_Mission.add(res.timings.duration);
    });

    group('noti_missionSuccess', function () {
        const body = {};

        const endPoint = '/mission/get_success_mission_notiPage';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Noti_MissionSuccess.add(res.timings.duration);
    });

    sleep(1);
}
