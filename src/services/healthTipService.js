import api from "./api";

// Admin endpoints
export const getAdminTips = async (page = 1, search = "", status = "all") => {
    const response = await api.get(`/health-tips?page=${page}&search=${search}&status=${status}`);
    return response.data;
};

export const getTipById = async (id) => {
    const response = await api.get(`/health-tips/${id}`);
    return response.data;
};

export const createTip = async (data) => {
    const response = await api.post("/health-tips", data);
    return response.data;
};

export const updateTip = async (id, data) => {
    const response = await api.put(`/health-tips/${id}`, data);
    return response.data;
};

export const deleteTip = async (id) => {
    const response = await api.delete(`/health-tips/${id}`);
    return response.data;
};

export const toggleTipStatus = async (id) => {
    const response = await api.patch(`/health-tips/${id}/toggle`);
    return response.data;
};

// User endpoints
export const getActiveTips = async (limit = 6) => {
    const response = await api.get(`/health-tips/public?limit=${limit}`);
    return response.data;
};