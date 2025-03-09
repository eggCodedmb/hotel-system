import request from "@/utils/request";

// GET请求
export function getList(params) {
  return request.get("/user/list", params, {
    headers: { "X-Custom-Header": "value" },
    timeout: 30000, // 单独设置超时时间
  });
}

// POST请求
export function createUser(data) {
  return request.post("/user/create", data);
}

// 文件上传
export function uploadFile(file) {
  return request.postFormData("/upload", { file });
}

// 错误处理
request
  .get("/error-api")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error("捕获错误:", err);
  });
