// controllers/mpesa.controller.js
import { initiateSTKPush } from '../services/mpesa.service.js';

export const stkPush = async (req, res) => {
    const { phone, amount } = req.body;
    
    try {
        console.log(`[STK PUSH] Initiating payment: Phone=${phone}, Amount=${amount}`);
        const response = await initiateSTKPush(phone, amount);
        console.log(`[STK PUSH] Success: RequestID=${response.CheckoutRequestID || 'N/A'}`);
        res.status(200).json(response);
    } catch (error) {
        // Create a structured error object for logging
        const errorDetails = {
            timestamp: new Date().toISOString(),
            endpoint: 'stkPush',
            requestParams: { phone, amount },
            errorType: error.name || 'Unknown Error',
            message: error.message || 'No error message',
            stack: error.stack,
        };
        
        // Add API response details if available
        if (error.response) {
            errorDetails.statusCode = error.response.status;
            errorDetails.statusText = error.response.statusText;
            errorDetails.apiResponse = error.response.data;
            
            // Extract specific M-Pesa error codes if available
            if (error.response.data && error.response.data.errorCode) {
                errorDetails.mpesaErrorCode = error.response.data.errorCode;
                errorDetails.mpesaErrorMessage = error.response.data.errorMessage;
            }
        } else if (error.request) {
            // The request was made but no response was received
            errorDetails.networkError = 'No response received from API';
            errorDetails.request = {
                method: error.request.method,
                path: error.request.path,
                host: error.request.host,
            };
        }
        
        // Log the structured error with clear formatting
        console.error('\n========== STK PUSH ERROR ==========');
        console.error(JSON.stringify(errorDetails, null, 2));
        console.error('====================================\n');
        
        // Send appropriate error response to client
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.errorMessage || 'Failed to initiate STK Push';
        
        res.status(statusCode).json({ 
            success: false,
            error: errorMessage,
            errorCode: error.response?.data?.errorCode || 'UNKNOWN_ERROR'
        });
    }
};

export const handleCallback = (req, res) => {
    console.log('STK Callback:', JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: 'Callback received successfully' });
};
