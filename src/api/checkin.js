import request from "@/utils/request";

const service = 'accommodation'

// 添加入住记录
export function addCheckin(data) {
    return request.post(`${service}/addAccommodation`, data);
}

// 获取入住记录列表
export function getCheckinList(data) {
    return request.get(`${service}/list`, data);
}

// 修改入住记录
export function updateCheckin(data) {
    return request.post(`${service}/updateAccommodation`, data);
}

// 删除入住记录
export function deleteCheckin(id) {
    return request.post(`${service}/deleteAccommodation`, { id });
}

// 获取入住记录详情
export function getCheckinDetail(id) {
    return request.post(`${service}/queryAccommodationOne`, id);
}
