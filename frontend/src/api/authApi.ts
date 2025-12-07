import axiosClient from "./axiosClient";

const authApi = {
  register(data: any) {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },

  login(data: any) {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },

  // Hàm gọi API lấy profile (ví dụ để test token)
  getProfile() {
    const url = '/auth/profile';
    return axiosClient.get(url);
  }
};

export default authApi;