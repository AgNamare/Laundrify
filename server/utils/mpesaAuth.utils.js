// utils/mpesaAuth.utils.js
import unirest from 'unirest';

const getMpesaToken = () => {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');

        unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
            .headers({ 'Authorization': `Basic ${auth}` })
            .end(res => {
                if (res.error) return reject(res.error);
                const data = JSON.parse(res.raw_body);
                resolve(data.access_token);
            });
    });
};

export default getMpesaToken;
