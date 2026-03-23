import axios from 'axios';
import { customFetch } from './apiRequest';

export const fetchContributions = async (url: string) => {
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

export const fetchContribution = async (groupId: string) => {
  try {
    const response = await customFetch.get(`/contributions/${groupId}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

export const fetchPayment = async (reference: string) => {
  try {
    const response = await customFetch.get(
      `/payments/verify-contribution/${reference}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

export const fetchContributionMembers = async (url: string) => {
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

// Generic data fetching function
export const fetchData = async (url: string) => {
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw Response.json(error?.response?.data);
    }
  }
};

// Generic data fetching function
export const fetchOnlyData = async (url: string) => {
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error?.response?.data;
    }
  }
};
