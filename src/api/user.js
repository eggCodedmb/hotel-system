import request from '@/utils/request';

const service = 'employeeManagerment';

// 增加员工 /employeeManagerment/addEmployee
export function addEmployee(params) {
  return request.put(`/${service}/addEmployee`, params);
}

// 获取员工列表
export function getEmployeeList(data) {
  return request.post(`/${service}/list`, data);
}

// 修改员工信息 /employeeManagerment/updateEmployee
export function updateEmployee(params) {
  return request.post(`/${service}/updateEmployee`, params);
}

// 删除员工 /employeeManagerment/deleteEmployee
export function deleteEmployee(id) {
  return request.delete(`/${service}/deleteEmployee`, { id });
}


// 获取员工详情
export function getEmployeeDetail(id) {
  return request.get(`/${service}/getOne`, { id });
}