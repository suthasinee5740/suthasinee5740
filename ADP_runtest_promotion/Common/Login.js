import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';

const CheckLogin = new Trend('Login');

const errorRate = new Rate('error_rate')
export default function Authen() {

    group('Function Authen', function () {
        group('Login', function () {
            const body = {
                username: ProfileDefult.username,
                password: ProfileDefult.password,
            };
            const endPoint = '/auth/login';
            const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers()});
            ProfileDefult.accessToken = res.json().data.accessToken;
            
            const passed = check(res, {
                "status is 200": (r) => r.status === 200,
                "verify Token": (r) => r.body.includes(ProfileDefult.accessToken),
            });
            errorRate.add(!passed)
            CheckLogin.add(res.timings.duration);
        });

    });
}

