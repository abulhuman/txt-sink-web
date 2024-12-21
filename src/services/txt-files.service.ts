import { APIService } from "./api.service";
import { API_ROUTES } from "./lib/constants";


export type TxtFile = {
  id: number;
  created_date: string;
  modified_date: string;
  name: string;
  uri: string;
  size: number;
  contents: string;
  tags: string;
};

class TxtFilesService extends APIService {
  async getTxtFiles() {
    try {
      const response = await this.axiosInstance.get<TxtFile[]>(API_ROUTES.FILES);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const txtFilesService: TxtFilesService = new TxtFilesService();