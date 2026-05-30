import { api } from "../api";

// Quiza se afina lyego para que acepte mas cosas
export const UploadFileService = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await api.post(
        "/s3/upload",
        formData,
        {
            timeout: 1000 * 60 * 5, // 5 min
        },
    );

    return data;
};

