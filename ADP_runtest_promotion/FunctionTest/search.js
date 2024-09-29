import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import Message from '../Config/globalMessage.js';
import statusHttp from '../Common/checkHTTPstatus.js';

const CheckSuggestSearch = new Trend('trend_search_suggestSearch');
const Check_Search_TopSearch = new Trend('trend_search_topSearch');
const Check_Search = new Trend('trend_Search');

export default function search() {

    group('search_suggestSearch', function () {
        const endPoint = '/search2/suggest_search?search=iphone';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const suggesSearch = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            "verify Response ": (r) => r.body.includes("iphone")
        };

        check_error(endPoint, res, checks);
        CheckSuggestSearch.add(res.timings.duration);
    });

    group('search_topSearch', function () {
        const endPoint = '/search/top_search';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ'
        };

        check_error(endPoint, res, checks);
        Check_Search_TopSearch.add(res.timings.duration);
    });

    group('search', function () {
        const body = {
            "text": "a55 5g",
            "set": 1,
            "filter": [],
            "isPromotionOnly": false
        };

        const endPoint = '/search2/search';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'สำเร็จ'
        };

        check_error(endPoint, res, checks);
        Check_Search.add(res.timings.duration);
    });

    sleep(1);
}
