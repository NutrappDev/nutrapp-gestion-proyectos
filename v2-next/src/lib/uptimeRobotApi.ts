import axios, { AxiosError, AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.error('⚠️ NEXT_PUBLIC_API_URL no está definida');
  console.error('Añade en .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000/api');
}

// Instancia Axios
const uptimeRobotApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

uptimeRobotApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }
  return config;
});

uptimeRobotApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const contentType = error.response.headers?.['content-type'];
      const isHtmlResponse = contentType?.includes('text/html');
      if (isHtmlResponse) {
        throw new Error(`Server returned HTML (likely 404). Check API endpoint: ${API_BASE_URL}`);
      }
      throw new Error(
        `API Error: ${error.response.status} - ${(error.response.data as { message?: string })?.message ?? error.message
        }`
      );
    } else if (error.request) {
      throw new Error(`Network Error: No response from ${API_BASE_URL}. Is the server running?`);
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export const getUptimeRobotMonitoring = async () => {
  const { data } = await uptimeRobotApiClient.get('/uptimeRobot/monitoring')
  return data
}