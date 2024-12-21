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
      // return { data: { data: DUMMY_DATA }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async uploadTxtFile(file: File, tags: string[] = []) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("tags", tags.map(tag => tag.trim()).join(","));
      const response = await this.axiosInstance.post(`${API_ROUTES.FILES}upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { data: response.data, error: null };
      // return { data: { data: DUMMY_DATA[0] }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const txtFilesService: TxtFilesService = new TxtFilesService();