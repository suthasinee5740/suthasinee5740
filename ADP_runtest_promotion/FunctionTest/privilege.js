import { group, sleep } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics'
import { requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';


const Check_Privilege_ItemPrivilege = new Trend('trend_privilege_itemPrivilege');
const Check_Privilege_Promotion = new Trend('trend_privilege_Promotion')

export default function privilege() {

    group('privilege_itemPrivilege', function () {
        const endPoint = 'privilege_promotion/get-privilege-promotion-items?promotionNo=PVL-000147';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const privilegeItem = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ขอข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Privilege_ItemPrivilege.add(res.timings.duration);
    });

    group('privilege_Promotion', function () {
        const endPoint = '/privilege_promotion/get-allbanner-privilege-promotion';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const privilegeItem = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ขอข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Privilege_Promotion.add(res.timings.duration);
    });

    sleep(1);
}
