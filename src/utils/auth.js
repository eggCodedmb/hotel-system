// 获取getToken
export function getToken() {
  return localStorage.getItem('token');
}

// 设置token
export function setToken(rawToken) {
  // 安全提取token
  const token = rawToken.includes('：')
    ? rawToken.split('：')[1].trim()
    : rawToken.replace(/[^a-zA-Z0-9-_=.]/g, ''); // 备用清理方法

  // 验证token格式
  if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/.test(token)) {
    throw new Error('无效的token格式');
  }

  // 保存token
  localStorage.setItem('token', token);
}

// 移除token
export function removeToken() {
  localStorage.removeItem('token');
}
