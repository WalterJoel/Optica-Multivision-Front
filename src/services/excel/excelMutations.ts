import { api } from "../api";

export const insertarMonturasExcelService = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/productos/monturas/insertarMonturasExcel",
    formData,
    {
      timeout: 1000 * 60 * 5, // 5 min
    },
  );

  return data;
};

export const editarMonturasExcelService = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/productos/monturas/editarMonturasExcel",
    formData,
    {
      timeout: 1000 * 60 * 5, // 5 min
    },
  );

  return data;
};

export const insertarAccesoriosExcelService = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/productos/accesorios/insertarAccesoriosExcel",
    formData,
    {
      timeout: 1000 * 60 * 5, // 5 min
    },
  );

  return data;
};

export const editarAccesoriosExcelService = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/productos/accesorios/editarAccesoriosExcel",
    formData,
    {
      timeout: 1000 * 60 * 5, // 5 min
    },
  );

  return data;
};

