import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const customFetch = axios.create({
  baseURL: '/api/v1',
});

export const queryClient = new QueryClient();

export const extractFormData = async (request: Request) => {
  const formData = await request.formData();
  return Object.fromEntries(formData);
};

export const extractParams = (request: Request) => {
  return Object.fromEntries([...new URL(request.url).searchParams.entries()]);
};
