import request from "@/utils/request";

// 登录
export function login(params) {
  return request.get("/base/login", params, { timeout: 5000 });
}

// 获取用户登录信息
export function getLoginInfo(params) {
  return request.get("/base/getLoginInfo", params, { timeout: 5000 });
}
