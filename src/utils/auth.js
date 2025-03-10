// 获取getToken
export function getToken() {
  return localStorage.getItem("token");
}

// 设置token
export function setToken(token) {
  localStorage.setItem("token", token);
}

// 移除token
export function removeToken() {
  localStorage.removeItem("token");
}
