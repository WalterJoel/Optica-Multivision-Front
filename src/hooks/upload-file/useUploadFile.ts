import { useState } from "react";

import { UploadFileService, IUploadResponse } from "@/services/upload-file";

export function useUploadFile() {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const uploadFile = async (file: File): Promise<IUploadResponse> => {
        setLoading(true);

        setSuccess(false);

        setStatusMessage("");

        try {
            const response = await UploadFileService(file);

            setSuccess(true);

            setStatusMessage("Imagen subida correctamente");

            return response;
        } catch (err: any) {
            console.error(err);

            const backendMessage = err?.response?.data?.message;

            setStatusMessage(
                backendMessage
                    ? `Error al subir imagen: ${backendMessage}`
                    : "Error al subir imagen",
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadFile,

        loading,

        statusMessage,

        success,
    };
}
