import request from '@/utils/request';

const service = 'leaveManager';

// 添加请假记录
export function addLeave(params) {
  return request.post('/leaveApproval/addLeaveApproval', params);
}

// 获取请假记录列表
// 导出一个函数，用于获取请假列表
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

// 审批
export function approveLeave(id) { }

// 拒绝
export function rejectLeave(id) { }
