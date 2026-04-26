import client from './client';

export const createOrder = async (sessionId: string, paymentMethod = 'card') => {
  const res = await client.post('/order', {
    session_id: sessionId,
    payment_method: paymentMethod,
  });
  return res.data;
};

export const completePayment = async (orderId: number, sessionId: string) => {
  const res = await client.post(`/order/${orderId}/payment`, {
    session_id: sessionId,
  });
  return res.data;
};

export const getOrders = async (sessionId: string) => {
  const res = await client.get(`/order/${sessionId}`);
  return res.data;
};