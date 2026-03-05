import { apiClient, saveTokens, clearTokens } from './client';
import { ApiEndpoints, RequestOtpDto, VerifyOtpDto, OtpResponse, AuthTokens } from '@ringtalk/shared';

export const authApi = {
  requestOtp: async (dto: RequestOtpDto): Promise<OtpResponse> => {
    const { data } = await apiClient.post(ApiEndpoints.auth.requestOtp, dto);
    return data.data as OtpResponse;
  },

  verifyOtp: async (dto: VerifyOtpDto): Promise<AuthTokens & { isNewUser: boolean }> => {
    const { data } = await apiClient.post(ApiEndpoints.auth.verifyOtp, dto);
    const result = data.data as AuthTokens & { isNewUser: boolean };
    await saveTokens(result.accessToken, result.refreshToken);
    return result;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ApiEndpoints.auth.logout);
    } finally {
      await clearTokens();
    }
  },
};
