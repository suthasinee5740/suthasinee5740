import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics'
import { errorRate, requestCount, myTrend } from '../Config/Metrics.js';
import { check_error } from '../Config/checkLogerror.js';

import ProfileDefult from '../Config/Default.js';
import headers from '../Config/headers.js';
import statusHttp from '../Common/checkHTTPstatus.js';
import Message from '../Config/globalMessage.js';
import CartData from '../data/Cart/cartData.js';

const CheckupdateProducttocart = new Trend('trend_update_product_cart');
const CheckgetCustomercart = new Trend('trend_check_customer_cart');
const CheckdeleteCustomercart = new Trend('trend_delete_customer_cart');

let IDcart = '';
function clearCart() {

    //Clear Cart
    const endPointgetCart = '/cart?deviceID=';
    const resgetCart = http.get(`${ProfileDefult.devUrl}${endPointgetCart}${CartData.deviceId}`, { headers: headers() });
    const resJson = JSON.parse(resgetCart.body)
    const getCustomercartData = resJson.data
    IDcart = getCustomercartData.cartID;

    const body = {
        cartID: `${IDcart}`
    };
    const endPoint = '/cart';
    const res = http.del(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });

}

export default function cart() {

    clearCart()
    //เพิ่มสินค้าในตะกร้า 
    group('cart_update_product_cart', function () {
        const body = {
            "deviceID": CartData.deviceId,
            "products": CartData.product
        };

        const endPoint = '/cart/updateProductToCart';
        const res = http.post(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
        const resJson = JSON.parse(res.body)
        const productCartData = resJson.data.cart
        const totalQty = resJson.data.productQtyInCart

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const sumTotalqty = productCartData.reduce((partialSum, {Qty_InCart}) => partialSum + Qty_InCart , 0);
        //console.log(sumTotalqty)

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'success',

            // ['ตรวจสอบจำนวนสินค้าในตะกร้าสินค้า ' + qtyCartData.productQtyInCart + ' ชิ้น']: (r) =>
            //     qtyCartData.productQtyInCart === 2 &&
            //     productCartData.Item_Number === 'G021212-WC2101A-WT',

            ["ตรวจสอบสินค้าในตะกร้า"]: (r) => {
                var result = true
                for (let i = 0; i < productCartData.length; i++) {
                    let tmpProduct = productCartData[i]
                    var iscartExists = CartData.product.some(x => x.itemNumber == tmpProduct.Item_Number && 
                        x.qty == tmpProduct.Qty_InCart)
                    if (!iscartExists) {
                        console.log(CartData.product[i])
                        result = false;
                        break;
                    }
                }
                return result
            },

            ['ตรวจสอบจำนวนสินค้าทั้งหมด ' + totalQty + ' ชิ้น']: (r) => sumTotalqty === totalQty
        };

        check_error(endPoint, res, checks);
        CheckupdateProducttocart.add(res.timings.duration);
    });

    //ตรวจสอบสินค้าในตะกร้า
    group('cart_getCustomer_cart', function getCustomer_cart() {

        const endPoint = '/cart?deviceID=';
        const res = http.get(`${ProfileDefult.devUrl}${endPoint}${CartData.deviceId}`, { headers: headers() });
        const resJson = JSON.parse(res.body)
        const getCustomercartData = resJson.data
        IDcart = getCustomercartData.cartID;

        requestCount.add(1);
        myTrend.add(res.timings.waiting);

        const checks = {
            [Message.Status200]: (r) => statusHttp(r.status, 200),
            [Message.Message + resJson.message]: (r) => resJson.message == 'ดึงข้อมูลสำเร็จ',
            ['ตรวจสอบ ID ตะกร้าสินค้า ' + IDcart]: (r) => IDcart !== null,
            ['ตรวจสอบรายการสินค้าในตะกร้าสินค้า']: (r) => getCustomercartData.items !== null,
        };

        check_error(endPoint, res, checks);
        CheckgetCustomercart.add(res.timings.duration);

        return IDcart;
    });

    // ลบสินค้าในตะกร้า
    // group('cart_delete_cart', function () {

    //     const body = {
    //         cartID: `${IDcart}`
    //     };
    //     //console.log(IDcart);

    //     const endPoint = '/cart';
    //     const res = http.del(`${ProfileDefult.devUrl}${endPoint}`, JSON.stringify(body), { headers: headers() });
    //     const resJson = JSON.parse(res.body)

    //     requestCount.add(1);
    //     myTrend.add(res.timings.waiting);

    //     const checks = {
    //         [Message.Status200]: (r) => statusHttp(r.status, 200),
    //         [Message.Message + resJson.message]: (r) => resJson.message == 'ลบข้อมูลสำเร็จ',
    //         ['ตรวจสอบข้อมูลในตะกร้าสินค้า ' + resJson.data]: (r) => resJson.data === null
    //     };

    //     check_error(endPoint, res, checks);
    //     CheckdeleteCustomercart.add(res.timings.duration);
    // });

    sleep(1);
}
