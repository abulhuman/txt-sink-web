import axios, { AxiosInstance } from 'axios';

export class APIService {
  axiosInstance: AxiosInstance = axios;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    });
  }
}