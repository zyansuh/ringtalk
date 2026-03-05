import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiEndpoints } from '@ringtalk/shared';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: 액세스 토큰 자동 첨부
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  const deviceId = await SecureStore.getItemAsync('device_id');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (deviceId) config.headers['X-Device-Id'] = deviceId;

  return config;
});

// 응답 인터셉터: 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const deviceId = await SecureStore.getItemAsync('device_id');

      if (!refreshToken || !deviceId) {
        await clearTokens();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}${ApiEndpoints.auth.refresh}`, {
          refreshToken,
          deviceId,
        });

        const tokens = data.data;
        await saveTokens(tokens.accessToken, tokens.refreshToken);
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(original);
      } catch {
        await clearTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync('access_token', accessToken),
    SecureStore.setItemAsync('refresh_token', refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]);
}
