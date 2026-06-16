import api from "./api";

export const getVaccines = async (page = 1, search = "") => {
  const response = await api.get(`/vaccines?page=${page}&search=${search}`);
  return response.data;
};

export const createVaccine = async (data) => {
  const response = await api.post("/vaccines", data);
  return response.data;
};

export const updateVaccine = async (id, data) => {
  const response = await api.put(`/vaccines/${id}`, data);
  return response.data;
};

export const deleteVaccine = async (id) => {
  const response = await api.delete(`/vaccines/${id}`);
  return response.data;
};

