import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getToken, removeToken } from '@/utils/auth';
import BeautifyConsole from "beautify-console-log";

const log = BeautifyConsole.getInstance();

class HttpClient {
  constructor(config) {
    this.service = axios.create(config);

    // 请求拦截
    this.service.interceptors.request.use(
      this.handleRequestSuccess,
      this.handleRequestError
    );

    // 响应拦截
    this.service.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError
    );
  }

  // 请求成功处理
  handleRequestSuccess = (config) => {
    // 自动携带Token
    if (getToken()) {
      config.headers['token'] = `${getToken()}`;
    }

    // 自动处理不同Content-Type
    if (config.contentType === 'form') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.transformRequest = [(data) => this.stringifyFormData(data)];
    } else if (config.contentType === 'form-data') {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // 请求计时开始
    config.metadata = { startTime: new Date() };
    return config;
  };

  // 请求错误处理
  handleRequestError = (error) => {
    return Promise.reject(error);
  };

  // 响应成功处理
  handleResponseSuccess = (response) => {
    // 请求计时结束
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    log.config({
      title: `请求 ${response.config.url} 耗时 ${duration}ms`,
    })

    // 处理二进制数据
    if (response.config.responseType === 'blob') {
      return response.data;
    }

    // 根据业务状态码处理
    const { code, data, message } = response.data;

    if (code === 200) {
      return response.data;
    } else {
      this.handleBusinessError(code, message);
      return Promise.reject(new Error(message || 'Error'));
    }
  };

  // 响应错误处理
  handleResponseError = (error) => {
    // 请求计时结束
    const endTime = new Date();
    const duration = error.config?.metadata?.startTime
      ? endTime - error.config.metadata.startTime
      : 0;

    log.error({
      title: `请求 ${error.config?.url} 耗时 ${duration}ms`,
      content: error
    })

    // 处理HTTP错误状态码
    const status = error.response?.status;
    let errorMessage = '请求错误';

    switch (status) {
      case 400:
        errorMessage = '请求参数错误';
        break;
      case 401:
        errorMessage = '登录已过期，请重新登录';
        removeToken();
        window.location.href = "/login";
        break;
      case 403:
        errorMessage = '没有操作权限';
        break;
      case 404:
        errorMessage = '资源不存在';
        break;
      case 500:
        errorMessage = '服务器错误';
        break;
      default:
        errorMessage = error.message || '未知错误';
    }

    ElMessage.error(errorMessage);
    return Promise.reject(error);
  };

  // 处理业务错误
  handleBusinessError(code, message) {
    console.error(`业务错误 ${code}: ${message}`);
    ElMessage.error(message || '操作失败');

    // // 特殊状态码处理
    // if (code === 401) {
    //   // 跳转登录页
    //   window.location.href = '/login'
    // }
  }

  // 通用请求方法
  request(config) {
    return this.service.request(config);
  }

  // GET请求
  get(url, params = {}, config = {}) {
    return this.service.get(url, { params, ...config });
  }

  // POST请求
  post(url, data = {}, config = {}) {
    return this.service.post(url, data, config);
  }

  // PUT请求
  put(url, data = {}, config = {}) {
    return this.service.put(url, data, config);
  }

  // DELETE请求
  delete(url, params = {}, config = {}) {
    return this.service.delete(url, { params, ...config });
  }

  // 表单编码处理
  stringifyFormData(data) {
    return Object.keys(data)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
      )
      .join('&');
  }

  // 文件上传方法
  postFormData(url, data, config = {}) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return this.post(url, formData, {
      contentType: 'form-data',
      ...config
    });
  }
}
const BASE_API = '/api';

// 创建实例
const service = new HttpClient({
  baseURL: BASE_API,
  timeout: 15000,
  withCredentials: true, // 跨域请求时是否需要使用凭证
  transformRequest: [
    (data, headers) => {
      // 自动转换请求数据
      if (headers['Content-Type'] === 'application/json') {
        return JSON.stringify(data);
      }
      return data;
    }
  ],
  transformResponse: [
    (data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }
  ]
});

export default service;
