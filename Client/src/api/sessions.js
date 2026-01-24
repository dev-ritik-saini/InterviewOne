import axiosInstance from '../lib/axios';

export const sessionApi = {
    createSession: async (data) => {
        const response = await axiosInstance.post("/session", data)
        return response.data;
    },
    getActiveSession: async () => {
        const response = await axiosInstance.get("/session/active")
        return response.data;
    },
    getMyRecentSession: async () => {
        const response = await axiosInstance.get("/session/my-recent")
        return response.data;
    },
    getSessionById: async (id) => {
        const response = await axiosInstance.get(`/session/${id}`)
        return response.data;
    },
    joinSession: async (id) => {
        const response = await axiosInstance.post(`/session/${id}/join`)
        return response.data;
    },
    endSession: async (id) => {
        const response = await axiosInstance.post(`/session/${id}/end`)
        return response.data;
    },
    getStreamToken: async () => {
        const response = await axiosInstance.get(`/chat/token`)
        return response.data;
    },

}