import { api } from "../api";

export interface IUploadResponse {
    url: string;
    key: string;
}

// Quiza se afina lyego para que acepte mas cosas
export const UploadFileService = async (file: File): Promise<IUploadResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await api.post<IUploadResponse>(
        "/s3/upload",
        formData,
        {
            timeout: 1000 * 60 * 5, // 5 min
        },
    );

    return data;
};

