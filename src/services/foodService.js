import api from "./api";

// Admin endpoints
export const getAdminFoods = async (page = 1, search = "", species = "", status = "all") => {
    const response = await api.get(`/foods?page=${page}&search=${search}&species=${species}&status=${status}`);
    return response.data;
};

export const getFoodById = async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
};

export const createFood = async (data) => {
    const response = await api.post("/foods", data);
    return response.data;
};

export const updateFood = async (id, data) => {
    const response = await api.put(`/foods/${id}`, data);
    return response.data;
};

export const deleteFood = async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
};

export const toggleFoodStatus = async (id) => {
    const response = await api.patch(`/foods/${id}/toggle`);
    return response.data;
};

// User endpoints
export const getActiveFoods = async (limit = 6, species = "all") => {
    const response = await api.get(`/foods/public?limit=${limit}&species=${species}`);
    return response.data;
};