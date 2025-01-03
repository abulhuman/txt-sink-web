import { TxtFileListResponse, TxtFileSearchBy } from "../types/txt-files";
import { APIService } from "./api.service";
import { API_ROUTES } from "./lib/constants";

class TxtFilesService extends APIService {
  async getTxtFiles(searchBy: TxtFileSearchBy | undefined, query: string) {
    try {
      const response = await this.axiosInstance.get<TxtFileListResponse[]>(
        API_ROUTES.FILES,
        {
          params: { search_by: query ? searchBy : undefined, q: query ?? "" },
        });
      return { data: response.data, error: null };
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
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const txtFilesService: TxtFilesService = new TxtFilesService();