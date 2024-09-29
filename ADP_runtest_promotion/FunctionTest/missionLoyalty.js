import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
//import { count } from 'console';

const Check_MissionLoyalty_Progress = new Trend('Check_MissionLoyalty_Progress');
const Check_MissionLoyalty = new Trend('Check_MissionLoyalty');
const Check_MissionLoyalty_PackageCustomer = new Trend('Check_MissionLoyalty_PackageCustomer');
const Check_MissionLoyalty_SelectPackget = new Trend('Check_MissionLoyalty_SelectPackget');
const Check_MissionLoyalty_UpgradePackget = new Trend('Check_MissionLoyalty_UpgradePackget');
const Check_MissionLoyalty_DetailbyID = new Trend('Check_MissionLoyalty_DetailbyID');
const Check_MissionLoyalty_Product = new Trend('Check_MissionLoyalty_Product');


const errorRate = new Rate('error_rate')

export default function missionLoyalty() {
    //Authen();

    group('Function MissionLoyalty', function () {

        group('Check_MissionLoyalty_Progress', function () {
            const body = {
                missionLoyaltyID: 26
            };

            const endPoint = '/missionLoyalty/get_mission_loyalty_progress';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });

            const passed = check(res, {
                "status is 200": (r) => r.status === 200,
                "verify Message Request Success ": (r) => r.body.includes('request success'),
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_Progress.add(res.timings.duration);
        });

        group('Check_MissionLoyalty', function () {
            const body = {
                missionLoyaltyID: 26
            };

            const endPoint = '/missionLoyalty/get_mission_loyalty';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });

            const passed = check(res, {
                "status is 200": (r) => r.status === 200,
                "verify Message Request Success ": (r) => r.body.includes('request success'),
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty.add(res.timings.duration);
        });

        group('Check_MissionLoyalty_PackageCustomer', function () {
            const endPoint = '/mission/get_package_customer';
            const res = http.get(`${ProfileDefult.devUrl}${endPoint}`, { headers: headers() });

            const passed = check(res, {
                'Post status is 200': (r) => res.status === 200,
                "Verify message Home new Banner": (r) => r.body.includes("ดึงข้อมูลสำเร็จ")
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_PackageCustomer.add(res.timings.duration);
        });

        group('Check_MissionLoyalty_SelectPackget', function () {
            const body = {
                missionLoyaltyID: 1038
            };

            const endPoint = '/mission/select_package_customer';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });

            const passed = check(res, {
                "status is 200": (r) => r.status === 200,
                "verify Message Request Success ": (r) => r.body.includes('ดึงข้อมูลสำเร็จ'),
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_SelectPackget.add(res.timings.duration);
        });

        group('Check_MissionLoyalty_UpgradePackget', function () {
            const body = {
                newPackageLoyltyId: 27,
                oldPackageLoyltyId: 26
            };

            const endPoint = '/mission/upgrade_package_customer';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
            const passed = check(res, {
                'Post status is 200': (r) => res.status === 200,
                "Verify message Home new Banner": (r) => r.body.includes("เปลี่ยนแพ็คเกจสำเร็จเร็จ")
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_UpgradePackget.add(res.timings.duration);
        });

        group('Check_MissionLoyalty_DetailbyID', function () {
            const body = {
                mission_id: 8385
            };

            const endPoint = '/mission/get_mission_detail_by_id';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
            const passed = check(res, {
                'Post status is 200': (r) => res.status === 200,
                "Verify message Home new Banner": (r) => r.body.includes("ดึงข้อมูลสำเร็จ")
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_DetailbyID.add(res.timings.duration);
        });

        group('Check_MissionLoyalty_Product', function () {
            const body = {
                mission_id: 8385,
                page: 1,
                search_product: "why"
            };

            const endPoint = '/mission/get_product_in_mission';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
            const passed = check(res, {
                'Post status is 200': (r) => res.status === 200,
                "Verify message Home new Banner": (r) => r.body.includes("ดึงข้อมูลสำเร็จ")
            });

            if (res.status != 200) {
                console.error(endPoint + ' Could not send summary, got status ' + res.status, `\n` + 'Body: ' + res.body);
            }

            errorRate.add(!passed)
            Check_MissionLoyalty_Product.add(res.timings.duration);
            //console.log(res.body)
        });


    });
    sleep(1);
}
