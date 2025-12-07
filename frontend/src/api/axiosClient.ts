// Thay vì sử dụng fetch('http://...') để gọi trực tiếp đến các API.
// Sử dụng axiosClient để gọi API, giúp quản lý dễ dàng hơn (ví dụ: thêm header Authorization).
// File này định nghĩa một instance của axios với cấu hình sẵn.
// Giúp tự động gắn Token vào mọi request nếu người dùng đã đăng nhập.
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Đổi port nếu backend chạy khác 3000
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động gắn Token vào header nếu đã đăng nhập
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Xử lý phản hồi (Response)
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về data gọn gàng
        return response.data;
    },
    (error) => {
        // Nếu lỗi 401 (Hết hạn token) -> Có thể xử lý logout tự động tại đây
        return Promise.reject(error);
    }
);

export default axiosClient;