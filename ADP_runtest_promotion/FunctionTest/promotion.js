import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics'
import {errorRate, requestCount, myTrend} from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';

//Check Data

const Check_Promotion_CalPromotions = new Trend('trend_promotion_calPromotions');
const Check_Promotion_Item = new Trend('trend_promotion_Item');
const Check_Promotion_qtyMaxStep = new Trend('trend_promotion_qtyMaxStep');

export default function promotion() {

    group('promotion_calPromotions', function () {
        const body = {
            "items": [
                {
                    "Item_Number": "G024364-TB101-WT",
                    "qty": 5,
                    "Price": 650,
                    "customer_price_group": "LISTPRICE",
                    "Channel": "DPT",
                    "IBrand1": "Why",
                    "ItemG3": "64",
                    "PriceGroup": "TB-101",
                    "isPrivilege": false,
                    "groupId": null
                },
                {
                    "Item_Number": "G021821-UC2131A-WT",
                    "qty": 5,
                    "Price": 20,
                    "customer_price_group": "LISTPRICE",
                    "Channel": "DPT",
                    "IBrand1": "WHY",
                    "ItemG3": "21",
                    "PriceGroup": "UC-2131A",
                    "isPrivilege": false,
                    "groupId": null
                }
            ],
            "itemPro": null,
            "status": null,
            "proId": null,
            "isWebSaleOrder": true,
            "customerNo": "TBK-NMI-15-0027"
        };

        const endPoint = '/promotions/calPromotions';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)
        const calPromotion = resJson.data.resultCalPro

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'คำนวนโปรโมชันสำเร็จ',
        }; 

        check_error(endPoint, res, checks);
        Check_Promotion_CalPromotions.add(res.timings.duration);
    });

    group('promotion_getItem', function () {
        const endPoint = '/promotions/getPromotionItems?proId=["PRO-002863"]';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const getPromotionItems = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
        };

        check_error(endPoint, res, checks);
        Check_Promotion_Item.add(res.timings.duration);
    });

    group('promotion_qtyMaxStep', function () {

        const endPoint = '/promotions/qtyMaxStep?promotionId=PRO-002854';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
        };

        check_error(endPoint, res, checks);
        Check_Promotion_qtyMaxStep.add(res.timings.duration);
    })

    sleep(1);
}
