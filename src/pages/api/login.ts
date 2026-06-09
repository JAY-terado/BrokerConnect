import axiosClient from '../../../axiosinstance';

export interface LoginOtpResponse {
  success: boolean;
  message: string;
}

export const requestLoginOtp = async (identifier: string): Promise<LoginOtpResponse> => {
  try {
    const payload: { email?: string; mobile_number?: string } = {};
    if (identifier.includes('@')) {
      payload.email = identifier;
    } else {
      payload.mobile_number = identifier.replace(/[^0-9]/g, '');
    }

    const response = await axiosClient.post('/auth/login/request-otp', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as LoginOtpResponse;
    }
    throw error;
  }
};

export interface LoginVerifyResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    full_name: string;
    contact_number: string;
    role: string;
    broker_id: number;
  };
}

export const verifyLoginOtp = async (identifier: string, otp: number): Promise<LoginVerifyResponse> => {
  try {
    const payload: { email?: string; mobile_number?: string; otp: number } = { otp };
    if (identifier.includes('@')) {
      payload.email = identifier;
    } else {
      payload.mobile_number = identifier.replace(/[^0-9]/g, '');
    }

    const response = await axiosClient.post('/auth/login/verify-otp', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as LoginVerifyResponse;
    }
    throw error;
  }
};
