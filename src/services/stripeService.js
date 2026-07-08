import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createPaymentIntent = async (planId, token) => {
  console.log("Creating Payment Intent with planId:", planId, "Token exists:", !!token);
  try {
    const response = await axios.post(`${baseUrl}/api/payment/create-intent`, 
      { planId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      return {
        clientSecret: response.data.data.clientSecret,
        paymentIntentId: response.data.data.paymentIntentId
      };
    }
    return null;
  } catch (error) {
    if (error.response) {
      console.error(`Error in createPaymentIntent (${error.response.status}):`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error in createPaymentIntent:", error.message);
    }
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId, token) => {
  try {
    const response = await axios.post(`${baseUrl}/api/payment/confirm`, 
      { paymentIntentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error in confirmPayment (${error.response.status}):`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error in confirmPayment:", error.message);
    }
    throw error;
  }
};
