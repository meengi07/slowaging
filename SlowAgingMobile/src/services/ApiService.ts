import axios, {AxiosResponse} from 'axios';

// 기본 API 설정
const API_BASE_URL = 'https://api.slowaging.com/v1'; // 추후 실제 API 엔드포인트로 변경

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  config => {
    // 필요한 경우 인증 토큰 추가
    // config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  },
);

// API 서비스 클래스
class ApiService {
  // 음식 이미지 분석
  static async analyzeFoodImage(imageData: FormData): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.post(
        '/food/analyze',
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Food image analysis failed:', error);
      throw error;
    }
  }

  // 사용자 식단 로그 조회
  static async getFoodLogs(userId: number, dateRange?: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(`/users/${userId}/food-logs`, {
        params: {dateRange},
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch food logs:', error);
      throw error;
    }
  }

  // 헬스 체크 (테스트용)
  static async healthCheck(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default ApiService;
