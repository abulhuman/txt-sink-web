export type TxtFile = {
  id: number;
  created_date: string;
  modified_date: string;
  name: string;
  url: string;
  size: number;
  contents: string;
  tags: string;
};

export type TxtFileListResponse = {
  id: number;
  modified_date: string;
  name: string;
  size: number;
  tags: string;
  url: string;
};

export type TxtFileSearchBy = "tags" | "name" | "contents";

export type TxtFileUploadResponse = {
  message: string;
  s3_object_url: string;
};