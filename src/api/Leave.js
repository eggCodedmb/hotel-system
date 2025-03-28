import request from '@/utils/request';

const service = 'leaveManager';

// 添加请假记录
export function addLeave(params) {
  return request.post('/leaveApproval/addLeaveApproval', params);
}

// 获取请假记录列表
export function getLeaveList(data) {
  return request.post('/leaveApproval/listLeaveApproval', data);
}

// 修改请假记录
export function updateLeave(params) {
  return request.post('/leaveApproval/updateLeaveApproval', params);
}

// 删除请假记录
export function deleteLeave(id) {
  return request.post('/leaveApproval/deleteLeaveApproval', { id });
}

// 获取个人请假记录列表
export function getPersonalLeaveList(data) {
  return request.post('/leaveApproval/listPersonalLeaveApproval', data);
}