import api from "./api";

export const getPets = async (page = 1, search = "", species = "") => {
  const response = await api.get(
    `/pets?page=${page}&search=${search}&species=${species}`
  );
  return response.data;
};

export const createPet = async (data) => {
  // Jika data adalah FormData, axios akan otomatis set header yang sesuai
  const response = await api.post("/pets", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePet = async (id, data) => {
  const response = await api.put(`/pets/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePet = async (id) => {
  const response = await api.delete(`/pets/${id}`);
  return response.data;
};

