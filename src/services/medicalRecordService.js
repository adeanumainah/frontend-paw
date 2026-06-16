import api from "./api";

export const getMedicalRecords = async (page = 1, search = "") => {
  const response = await api.get(`/medical?page=${page}&search=${search}`);
  return response.data;
};

export const createMedicalRecord = async (data) => {
  const response = await api.post("/medical", data);
  return response.data;
};

export const updateMedicalRecord = async (id, data) => {
  const response = await api.put(`/medical/${id}`, data);
  return response.data;
};



export const deleteMedicalRecord = async (id) => {
  const response = await api.delete(`/medical/${id}`);
  return response.data;
};