import http from 'k6/http';
import { check } from 'k6';
import { open } from 'k6/fs';

// URL ของ API ที่ใช้ในการคำนวณโปรโมชั่น
const url = 'https://example.com/calculate-promotion';

// อ่านไฟล์ JSON ที่ถูกแปลงจาก CSV
const forecastData = JSON.parse(open('forecast.json'));

// ฟังก์ชันในการตรวจสอบและแสดงผลการคำนวณโปรโมชั่น
function validatePromotion(id, quantity, expectedPrice) {
    const payload = JSON.stringify({ quantity: quantity });
    const params = { headers: { 'Content-Type': 'application/json' } };

    let res = http.post(url, payload, params);

    // ตรวจสอบว่า status code เป็น 200
    let statusCheck = check(res, { 'status is 200': (r) => r.status === 200 });
    
    // ตรวจสอบว่า response body เป็น JSON ที่สามารถ parse ได้
    let isJSON = false;
    try {
        JSON.parse(res.body);
        isJSON = true;
    } catch (e) {
        isJSON = false;
    }
    
    let jsonCheck = check(res, { 'response is JSON': () => isJSON });
    
    if (isJSON) {
        let json = JSON.parse(res.body);
        
        // ตรวจสอบค่าที่คำนวณได้
        let priceCheck = check(json, {
            [`total price for ${quantity} items (Promotion ID ${id}) is correct`]: (data) => data.total_price === parseFloat(expectedPrice),
        });

        // แสดงผลการตรวจสอบ
        console.log(`Promotion ID: ${id}, Quantity: ${quantity}, Expected Price: ${expectedPrice}, Actual Price: ${json.total_price}`);
        console.log(`Status Check: ${statusCheck}, JSON Check: ${jsonCheck}, Price Check: ${priceCheck}`);
    } else {
        // แสดงผลเมื่อ response body ไม่สามารถ parse เป็น JSON ได้
        console.log(`Promotion ID: ${id}, Quantity: ${quantity}, Expected Price: ${expectedPrice}, Actual Response: ${res.body}`);
        console.log(`Status Check: ${statusCheck}, JSON Check: ${jsonCheck}`);
    }
}

export default function () {
    // เรียกฟังก์ชัน validatePromotion สำหรับแต่ละข้อมูลใน forecastData
    forecastData.forEach(data => {
        validatePromotion(data.id, data.quantity, data.expected_price);
    });
}
