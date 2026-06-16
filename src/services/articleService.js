import api from "./api";

// Admin endpoints
export const getAdminArticles = async (page = 1, search = "", category = "") => {
    const response = await api.get(`/articles?page=${page}&search=${search}&category=${category}`);
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
};

export const createArticle = async (data) => {
    const response = await api.post("/articles", data);
    return response.data;
};

export const updateArticle = async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
};

export const deleteArticle = async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
};

// User endpoints
export const getPublishedArticles = async (limit = 6, category = "") => {
    const response = await api.get(`/articles/public?limit=${limit}&category=${category}`);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get("/articles/categories");
    return response.data;
};