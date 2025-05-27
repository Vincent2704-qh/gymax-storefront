import { axiosClient } from "@/lib/axios";

export const FileService = {
  uploadFile(data: File | Blob) {
    const formData = new FormData();
    formData.append("file", data);

    return axiosClient.post<string>(
      `api/customers/upload-file`,
      formData,
      true
    );
  },
};
