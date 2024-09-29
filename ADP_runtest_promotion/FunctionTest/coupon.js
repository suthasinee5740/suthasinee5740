import { check, group, sleep, fail } from 'k6';

import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';

//CheckData
import CouponData from '../data/Coupon/couponData.js';

const Check_Coupon_All = new Trend('trend_coupon_All');
const Check_Coupon_Pick = new Trend('trend_coupon_Pick');
const Check_Coupon_Customer = new Trend('trend_coupon_Customer');

export default function coupon() {

    group('coupon_All', function () {
        const body = {
            set: 1,
        };

        const endPoint = '/coupon/Coupon_ALL';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)
        const couponList = resJson.data.Coupon
        const flashcoupon = resJson.data.FlashCoupon
        

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
            //เคส Fix
            "ตรวจสอบค่าเท่ากันหรือไม่" : (r) => couponList[0].id_coupon == CouponData[0].id_coupon,
            //
            "ตรวจสอบ มี Coupon ใน List": (r) => couponList.some(i => i.id_coupon == CouponData[0].id_coupon),
            "ตรวจสอบ มี Coupon ใน List กรณี มีหลายคูปอง": (r) => {
                var result = true
                for (let i = 0; i < CouponData.length; i++) {
                    var isCouponExists = couponList.some(x => x.id_coupon == CouponData[i].id_coupon)
                    if (!isCouponExists) {
                        console.log(CouponData[i])
                        result = false;
                        break;
                    }
                }
                return result
            }
        };

        check_error(endPoint, res, checks);
        Check_Coupon_All.add(res.timings.duration);
    
        sleep(1);

    });


    // group('coupon_Pick', function () {
    //     const body = {
    //         id_coupon: 'CP2024050000044',
    //     };

    //     const endPoint = '/coupon/Coupon_Pick';
    //     const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
    //     const resJson = JSON.parse(res.body)

    //     requestCount.add(1);
    //     myTrend.add(res.timings.waiting);

    //     const checks = {
    //         [Message.Status200]: (r) => statusHttp(r.status, 200),
    //         [Message.Message + resJson.message]: (r) => resJson.message == 'เก็บคูปองสำเร็จ',
    //     };

    //     check_error(endPoint, res, checks);
    //     Check_Coupon_Pick.add(res.timings.duration);
    // });

    // group('coupon_Customer', function () {
    //     const body = {
    //         "set": 1,
    //     };

    //     const endPoint = '/coupon/Conpon_Customer';
    //     const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
    //     const resJson = JSON.parse(res.body)
    //     const couponList = resJson.data.CouponUse

    //     requestCount.add(1);
    //     myTrend.add(res.timings.waiting);

    //     const checks = {
    //         [Message.Status200]: (r) => statusHttp(r.status, 200),
    //         [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
    //         // "ตรวจสอบ มี Coupon ใน List": (r) => couponList.some(i => i.id_coupon == CouponData[0].id_coupon),
    //     };

    //     check_error(endPoint, res, checks);
    //     Check_Coupon_Customer.add(res.timings.duration);
    // });
    sleep(1);

};
