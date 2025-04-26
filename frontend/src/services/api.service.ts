import axios, { AxiosInstance } from 'axios';
import { 
  GenerateRequestDto, 
  GenerationJobDto, 
  GenerationStatusDto 
} from '../types/api';

/**
 * API Service for BookAgent
 * Handles all communication with the backend
 */
class ApiService {
  private api: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request/response interceptors here if needed
  }

  /**
   * Start a new generation process
   */
  async startGeneration(request: GenerateRequestDto): Promise<GenerationJobDto> {
    const response = await this.api.post<GenerationJobDto>('/generate', request);
    return response.data;
  }

  /**
   * Get status and result of a generation job
   */
  async getGenerationStatus(jobId: string): Promise<GenerationStatusDto> {
    const response = await this.api.get<GenerationStatusDto>(`/generate/${jobId}/status`);
    return response.data;
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;
