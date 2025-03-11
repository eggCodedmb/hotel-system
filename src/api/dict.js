import request from "@/utils/request";

// 获取字典列表
export function getDictList(data) {
  return request.post("/PageDic", data);
}

// 获取字典详情
export function getDictDetail(id) {
  return request.post("/PageDicItem", id);
}

// 添加字典 /addDic
export function addDict(data) {
  return request.post("/addDic", data);
}

// 增加字典项
export function addDictItem(data) {
  return request.post("/addDicItem", data);
}

// 修改字典
export function updateDict(params) {
  return request.post("/updateDic", params);
}

// 更新字典项
export function updateDictItem(data) {
  return request.post("/updateDicItem", data);
}

// 删除字典
export function deleteDict(id) {
  return request.post("/deleteDic", id);
}

// 删除字典项
export function deleteDictItem(id) {
  return request.get(`/deleteDicItem?id=${id}`);
}
