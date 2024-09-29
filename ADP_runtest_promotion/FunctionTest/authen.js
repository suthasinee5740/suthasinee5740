import { check, group, sleep, fail } from 'k6';
import http from 'k6/http';
import { Rate, Trend, Counter } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';

//data
import redeemData from '../data/redeem/redeemHomedata.js';
import CouponData from '../data/Coupon/couponData.js';


const CheckLogin = new Trend('trend_authen_login');
const CheckgetProfile = new Trend('trend_authen_getProfile');
const CheckgetredeemHome = new Trend('trend_redeem_home')

export default function giveAwaynewCustomer() {

    group('authen_login', function () {
        const body = {
            username: ProfileDefult.username,
            password: ProfileDefult.password,
            ign: true,
        };
        const endPoint = '/auth/login';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const data = res.json()
        ProfileDefult.accessToken = data.data.accessToken;

        const checks = {
            // [Message.Status200]: (r) => statusHttp(r.status, 200),
            // 'Verify Access Token Login': (r) => r.body.includes(ProfileDefult.accessToken),
        };

        check_error(endPoint, res, checks);
        CheckLogin.add(res.timings.duration);

    });

    group('authen_getProfile', function () {
        const endPoint = '/auth/getProfile';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const getProfile = resJson.data

        const statusRedeem = getProfile.isActiveRewards
        let checkStatusredeem = ''
        if (statusRedeem === 1) {
            checkStatusredeem = "Active";
        } else {
            checkStatusredeem = "inActive";
        }

        const checks = {
            //[Message.Status200]: (r) => statusHttp(r.status, 200),
            //[Message.Message + resJson.message]: (r) => resJson.message == 'สำเร็จ',
            ['ตรวจสอบข้อมูล Username: ' + getProfile.customerNo]: (r) => getProfile.customerNo == ProfileDefult.username,
            ['ตรวจสอบข้อมูล GroupG: ' + getProfile.groupId]: (r) => getProfile.groupId === 'G1',
            ['ตรวจสอบ Status การได้รับสิทธิ Redeem: ' + checkStatusredeem]: (r) => getProfile.isActiveRewards === 1
        };

        check_error(endPoint, res, checks);
        CheckgetProfile.add(res.timings.duration);
    });

    group('redeem_home', function () {
        let customerGroup = 'LISTPRICE';
        const endPoint = '/dplus_reward/homeRedeem?customerGroup=';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}${customerGroup}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const redeemList = resJson.data
        const redeemitemsPoint = redeemList.itemsPoint[0]

        const checks = {
            //[Message.Status200]: (r) => statusHttp(r.status, 200),
            //[Message.Message + resJson.message]: (r) => resJson.message == 'สำเร็จ',
            // ["ตรวจสอบ มี Coupon ใน List"]: (r) => redeemList.some(i => i.Item_Number == redeemData[0].Item_Number),
            
            ["ตรวจสอบ item Redeem ลูกค้าใหม่: " + `\n`
                + redeemitemsPoint.ProductName + `\n`
                + "ราคา: " + redeemitemsPoint.Price + `\n`
                + "จำนวน Point ที่ต้องใช้แลก: " + redeemitemsPoint.pointQty
        ]: (r) => {
                    var result = true
                    for (let i = 0; i < redeemData.length; i++) {
                        var isredeemExists = redeemitemsPoint.some(x =>
                            x.Item_Number == redeemData[i].Item_Number &&
                            x.Price == redeemData[i].Price &&
                            x.pointQty == redeemData[i].pointQty
                        )
                        if (!isredeemExists) {
                            console.log(redeemData[i])
                            result = false;
                            break;
                        }
                    }
                    return result
                },
            ["ตรวจสอบ Quota Redeem ลูกค้าใหม่: " + redeemitemsPoint.quota]: (r) => {
                var result = true
                for (let i = 0; i < redeemData.length; i++) {
                    var isredeemExists = redeemitemsPoint.some(x =>
                        x.quota == redeemData[i].quota &&
                        x.Qty == redeemData[i].Qty
                    )
                    if (!isredeemExists) {
                        console.log(redeemData[i])
                        result = false;
                        break;
                    }
                }
                return result
            }
        };

        check_error(endPoint, res, checks);
        CheckgetredeemHome.add(res.timings.duration);
    });

    // group('coupon_All', function () {
    //     const body = {
    //         set: 1,
    //     };

    //     const endPoint = '/coupon/Coupon_ALL';
    //     const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
    //     const resJson = JSON.parse(res.body)
    //     const couponList = resJson.data.Coupon
    //     const flashcoupon = resJson.data.FlashCoupon

    //     const checks = {
    //         // [Message.Status200]: (r) => statusHttp(r.status, 200),
    //         // [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
    //         "ตรวจสอบ มี Coupon ใน List กรณี มีหลายคูปอง": (r) => {
    //             var result = true
    //             for (let i = 0; i < CouponData.length; i++) {
    //                 var isCouponExists = couponList.some(x => x.id_coupon == CouponData[i].id_coupon)
    //                 if (!isCouponExists) {
    //                     console.log(CouponData[i])
    //                     result = false;
    //                     break;
    //                 }
    //             }
    //             return result
    //         }
    //     };

    //     check_error(endPoint, res, checks);
    //     Check_Coupon_All.add(res.timings.duration);

    //     sleep(1);

    // });

    sleep(1);


};

// const authen = {
//     authen_Login: () => {
//         const body = {
//             username: ProfileDefult.username,
//             password: ProfileDefult.password,
//             ign: true,
//         };
//         const endPoint = '/auth/login';
//         const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
//         const data = res.json()
//         ProfileDefult.accessToken = data.data.accessToken;

//         // const checks = {
//         //     [Message.Status200]: (r) => statusHttp(r.status, 200),
//         //     'Verify Access Token Login': (r) => r.body.includes(ProfileDefult.accessToken),
//         // };

//         check_error(endPoint, res, checks);
//         CheckLogin.add(res.timings.duration);
//     },

//     authen_getProfile: () => {
//         const endPoint = '/auth/getProfile';
//         const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
//         const resJson = JSON.parse(res.body)
//         const getProfile = resJson.data

//         const statusRedeem = getProfile.isActiveRewards
//         let checkStatusredeem = ''
//         if (statusRedeem === 1) {
//             checkStatusredeem = "Active";
//         } else {
//             checkStatusredeem = "inActive";
//         }

//         const checks = {
//             //[Message.Status200]: (r) => statusHttp(r.status, 200),
//             //[Message.Message + resJson.message]: (r) => resJson.message == 'สำเร็จ',
//             ['ตรวจสอบข้อมูล Username: ' + getProfile.customerNo]: (r) => getProfile.customerNo == ProfileDefult.username,
//             ['ตรวจสอบข้อมูล GroupG: ' + getProfile.groupId]: (r) => getProfile.groupId === 'G1',
//             ['ตรวจสอบ Status การได้รับสิทธิ Redeem: ' + checkStatusredeem]: (r) => getProfile.isActiveRewards === 1
//         };

//         check_error(endPoint, res, checks);
//         CheckgetProfile.add(res.timings.duration);
//         CheckLogin.add(res.timings.duration);
//     }
// }
// export default authen;






