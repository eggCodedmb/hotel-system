import request from "@/utils/request";

// 登录
export function login(params) {
    return request.get("/base/login", params, { timeout: 5000 });
}