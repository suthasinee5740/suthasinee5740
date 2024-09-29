import { Trend, Counter, Rate } from 'k6/metrics';

export let myTrend = new Trend('waiting_time');
export let errorRate = new Counter('errors');
export let requestCount = new Counter('request_count');
