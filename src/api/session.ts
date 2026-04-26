import client from './client';

export const createSession = async (sessionId: string) => {
  const res = await client.post(`/session/${sessionId}`);
  return res.data;
};

export const getSession = async (sessionId: string) => {
  const res = await client.get(`/session/${sessionId}`);
  return res.data;
};