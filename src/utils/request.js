import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

// 创建基础实例
const service = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 自动携带 Token
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`;
    }
    return config;
  },
  error => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 处理二进制数据
    if (response.config.responseType === "blob") {
      return response.data;
    }

    // 处理业务逻辑
    const res = response.data;
    if (res.code === 200) {
      return res;
    } else {
      ElMessage.error(res.message || "操作失败");
      return Promise.reject(res);
    }
  },
  error => {
    // 统一错误处理
    let message = "请求失败";
    const status = error.response?.status;

    switch (status) {
      case 401:
        message = "登录已过期，请重新登录";
        window.location.href = "/login";
        break;
      case 403:
        message = "没有操作权限";
        break;
      case 500:
        message = "服务器错误";
        break;
    }

    ElMessage.error(message);
    return Promise.reject(error);
  }
);

// 封装常用方法
export default {
  get(url, params) {
    return service.get(url, { params });
  },

  post(url, data) {
    return service.post(url, data);
  },

  put(url, data) {
    return service.put(url, data);
  },

  delete(url, params) {
    return service.delete(url, { params });
  },

  // 文件上传简化版
  upload(url, file) {
    const formData = new FormData();
    formData.append("file", file);
    return service.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};