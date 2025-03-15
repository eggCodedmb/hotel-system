import request from '@/utils/request';

const service = 'roomManager';

// 添加房间
export function addRoom(params) {
  return request.post('/roomManager/addRoomManager', params);
}

// 获取房间列表
export function getRoomList(data) {
  return request.post('/roomManager/selectRoomManagerList', data);
}

// 修改房间
export function updateRoom(params) {
  return request.post('/roomManager/updateRoomManager', params);
}

// 删除房间
export function deleteRoom(id) {
  return request.delete(`/roomManager/deleteRoomManager?ids=${id}`);
}

// 获取房间详情
export function getRoomDetail(id) {
  return request.get('/roomManager/selectRoomManagerById', { id });
}
