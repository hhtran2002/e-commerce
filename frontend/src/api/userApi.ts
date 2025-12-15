// src/api/userApi.ts
import axiosClient from "./axiosClient";

const userApi = {
    getAll() {
        // Gọi API: GET /users
        // axiosClient sẽ tự gắn Header Authorization lấy từ localStorage
        return axiosClient.get('/users');
    },

    // Các hàm chờ sẵn (chưa dùng ngay nhưng cần khai báo)
    delete(id: number) {
        return axiosClient.delete(`/users/${id}`);
    },

    update(id: number, data: any) {
        return axiosClient.put(`/users/${id}`, data);
    }
};

export default userApi;