import apiClient from './client';

export interface OTPSendResponse {
  session_id: string;
  expires_in: number;
  dev_code?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  phone_number: string;
}

export const authApi = {
  sendOTP: async (phone_number: string): Promise<OTPSendResponse> => {
    const { data } = await apiClient.post('/api/v1/auth/otp/send', {
      phone_number,
    });
    return data;
  },

  verifyOTP: async (
    session_id: string,
    phone_number: string,
    code: string
  ): Promise<TokenResponse> => {
    const { data } = await apiClient.post('/api/v1/auth/otp/verify', {
      session_id,
      phone_number,
      code,
    });
    
    // Store token
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  },
};
