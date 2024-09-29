import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';

//Data Check
import homeNewbanner_Data from '../data/Home/Home_New_Banner.js';
import homeNewitem_Data from '../data/Home/Home_New_Item.js';
import homePrivilege_Data from '../data/Home/Home_New_Privilege.js';
import homeNewFlashsale_Data from '../data/Home/Home_New_Flashsale.js';
import homeNewPromotion_Data from '../data/Home/Home_New_Promotioin.js';


const CheckHomeNewBanner = new Trend('trend_home_newBanner');
const CheckHomeNewItem = new Trend('trend_home_newItem');
const CheckHomeNewPrivilege = new Trend('trend_home_newPrivilege');
const CheckHomeNewPromotion = new Trend('trend_home_newPromotion');
const CheckHomeNewFlasSale = new Trend('trend_home_newFlasSale');



export default function homes() {

    group('home_newBanner', function () {
        const endPoint = '/home/home-news-banner?brandName=All';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const bannerList = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == "ดึงข้อมูลสำเร็จ",
            "ตรวจสอบ Banner ทั้งหมด โดย ID และ ชื่อ": (r) => bannerList.some(i => i.production_no == homeNewbanner_Data[0].production_no &&
                i.product_name == homeNewbanner_Data[0].product_name),
            "ตรวจสอบ Banner ทั้งหมด": (r) => {
                var result = true
                for (let i = 0; i < homeNewbanner_Data.length; i++) {
                    var isBannerExists = bannerList.some(x => x.production_no == homeNewbanner_Data[i].production_no)
                    if (!isBannerExists) {
                        console.log(homeNewbanner_Data[i])
                        result = false;
                        continue;
                    }
                }
                return result
            }

        };

        check_error(endPoint, res, checks);
        CheckHomeNewBanner.add(res.timings.duration);
    });

    group('home_newItem', function () {
        const endPoint = '/home/home-news-items?brandName=ALL';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const bannerList = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == "ดึงข้อมูลสำเร็จ",
            // "ตรวจสอบข้อมูล New Item ทั้งหมด โดย ID และ ชื่อ": (r) => bannerList.some(i => i.Item_Number == homeNewitem_Data[0].Item_Number &&
            //     i.ProductName == homeNewitem_Data[0].ProductName),
            "ตรวจสอบข้อมูล NewItem ทั้งหมด": (r) => {
                var result = true
                for (let i = 0; i < homeNewitem_Data.length; i++) {
                    var isNewitemExists = bannerList.some(x => x.Item_Number == homeNewitem_Data[i].Item_Number)
                    if (!isNewitemExists) {
                        console.log(homeNewitem_Data[i])
                        result = false;
                        break;
                    }
                }
                return result
            }
        };

        check_error(endPoint, res, checks);
        CheckHomeNewItem.add(res.timings.duration);
    });

    group('home_newPrivilege', function () {
        const endPoint = '/home/home-news-privilegePromotionBanner?brandName=ALL';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const bannerList = resJson.data

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == "ดึงข้อมูลสำเร็จ",
            "ตรวจสอบข้อมูล New Privilege โดย ID และ ชื่อโปรโมชั่น": (r) => bannerList.some(i => i.promotion_no == homePrivilege_Data[0].promotion_no &&
                i.promotion_name == homePrivilege_Data[0].promotion_name)
            //"ตรวจสอบข้อมูล New Privilege": (r) => bannerList.some(i => i.promotion_no == homePrivilege_Data[0].promotion_no)

        };

        check_error(endPoint, res, checks);
        CheckHomeNewPrivilege.add(res.timings.duration);
    });

    group('home_newPromotion', function () {
        const endPoint = '/home/home-news-promotionBanner?brandName=ALL';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body);
        const bannerList = resJson.data;

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == "ดึงข้อมูลสำเร็จ",
            "ตรวจสอบข้อมูล New Promotion โดย ID และ ชื่อโปรโมชั่น": (r) => bannerList.some(i => i.promotion_no == homeNewPromotion_Data[0].promotion_no &&
                i.promotion_name == homeNewPromotion_Data[0].promotion_name),
            "ตรวจสอบข้อมูล Promotion ทั้งหมด": (r) => {
                var result = true
                for (let i = 0; i < homeNewPromotion_Data.length; i++) {
                    var isNewitemExists = bannerList.some(x => x.promotion_no == homeNewPromotion_Data[i].promotion_no)
                    if (!isNewitemExists) {
                        console.log(homeNewPromotion_Data[i])
                        result = false;
                        break;
                    }
                }
                return result
            }

        };

        check_error(endPoint, res, checks);
        CheckHomeNewPromotion.add(res.timings.duration);
    });

    group('home_newFlasSale', function () {

        const param = {
            brandName: 'ALL',
        };

        const endPoint = `/home/home-news-flashSaleBanner?brandName=ALL`;
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });
        const resJson = JSON.parse(res.body);
        const bannerList = resJson.data.bannerFlashsaleArr;

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == "ดึงข้อมูลสำเร็จ",
            "ตรวจสอบข้อมูล New Flashsale โดย ID และ ชื่อโปรโมชั่น": (r) => bannerList.some(i => i.id_flashsale == homeNewFlashsale_Data[0].id_flashsale &&
                i.name == homeNewFlashsale_Data[0].name),
            "ตรวจสอบข้อมูล Flashsale ทั้งหมด": (r) => {
                var result = true
                for (let i = 0; i < homeNewFlashsale_Data.length; i++) {
                    var isNewitemExists = bannerList.some(x => x.id_flashsale == homeNewFlashsale_Data[i].id_flashsale)
                    if (!isNewitemExists) {
                        console.log(homeNewFlashsale_Data[i])
                        result = false;
                        break;
                    }
                }
                return result
            }

        };

        check_error(endPoint, res, checks);
        CheckHomeNewFlasSale.add(res.timings.duration);
    });

    sleep(1);
}
