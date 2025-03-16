import request from '@/utils/request';

const service = 'employeeManagerment';

// 增加员工
export function addEmployee(params) {
  return request.put(`/${service}/addEmployee`, params, { params });
}

// 获取员工列表
export function getEmployeeList(data) {
  return request.post(`/${service}/list`, data);
}

// 修改员工信息
export function updateEmployee(params) {
  return request.post(`/${service}/updateEmployee`, params);
}

// 删除员工
export function deleteEmployee(id) {
  return request.delete(`/${service}/deleteEmployee`, { id });
}


// 获取员工详情
export function getEmployeeDetail(id) {
  return request.get(`/${service}/getOne`, { id });
}

// 重置密码
export function resetPassword(id) {
  return request.post(`/${service}/resetPassword?id=${id}`);
}