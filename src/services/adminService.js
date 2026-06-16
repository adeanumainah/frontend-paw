import api from "./api";

// Users
export const getUsers = async (search = "") => {
  const response = await api.get(`/admin/users?search=${search}`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Pets
export const getAdminPets = async (page = 1, search = "", species = "") => {
  const response = await api.get(`/admin/pets?page=${page}&search=${search}&species=${species}`);
  return response.data;
};

export const deletePetAdmin = async (id) => {
  const response = await api.delete(`/admin/pets/${id}`);
  return response.data;
};

// Vaccinations
export const getAdminVaccinations = async (page = 1, search = "") => {
  const response = await api.get(`/admin/vaccinations?page=${page}&search=${search}`);
  return response.data;
};

export const deleteVaccinationAdmin = async (id) => {
  const response = await api.delete(`/admin/vaccinations/${id}`);
  return response.data;
};

// Medical Records
export const getAdminMedicalRecords = async (page = 1, search = "") => {
  const response = await api.get(`/admin/medical-records?page=${page}&search=${search}`);
  return response.data;
};

export const deleteMedicalRecordAdmin = async (id) => {
  const response = await api.delete(`/admin/medical-records/${id}`);
  return response.data;
};

// Schedules
export const getAdminSchedules = async (page = 1, search = "", status = "all") => {
  const response = await api.get(`/admin/schedules?page=${page}&search=${search}&status=${status}`);
  return response.data;
};

export const deleteScheduleAdmin = async (id) => {
  const response = await api.delete(`/admin/schedules/${id}`);
  return response.data;
};
