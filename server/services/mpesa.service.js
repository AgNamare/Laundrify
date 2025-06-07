// services/mpesa.service.js
import axios from 'axios';
import getMpesaToken from '../utils/mpesaAuth.utils.js';
import moment from 'moment';

export const initiateSTKPush = async (phone, amount) => {
    const token = await getMpesaToken();

    const shortcode = '174379'; // Sandbox Shortcode
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: "https://yourdomain.com/api/mpesa/callback",
        AccountReference: "Test123",
        TransactionDesc: "Payment of X"
    };

    const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
};
