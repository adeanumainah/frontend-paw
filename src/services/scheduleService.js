import api from "./api";

export const getSchedules = async (page = 1, search = "", status = "all") => {
  const response = await api.get(`/schedules?page=${page}&search=${search}&status=${status}`);
  return response.data;
};

export const createSchedule = async (data) => {
  const response = await api.post("/schedules", data);
  return response.data;
};

export const updateSchedule = async (id, data) => {
  const response = await api.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};

export const getUpcomingSchedules = async (limit = 10) => {
  const response = await api.get(`/schedules/upcoming?limit=${limit}`);
  return response.data;
};
