import request from "@/utils/request";
// 添加房间
export function addRoom(params) {
    return request.post({
        url: "/roomManager/addRoomManager",
        data: params
    });
}

// 获取房间列表
export function getRoomList(data) {
    return request.post("/roomManager/selectRoomManagerList",
        data,);
}

// 修改房间
export function updateRoom(params) {
    return request.post({
        url: "/roomManager/selectRoomManagerList",
        data: params
    });
}

// 删除房间
export function deleteRoom(id) {
    return request.delete({
        url: "/roomManager/deleteRoomManager",
        params: { id }
    });
}

// 获取房间详情
export function getRoomDetail(id) {
    return request.get({
        url: "/roomManager/selectRoomManagerById",
        params: { id }
    });
}