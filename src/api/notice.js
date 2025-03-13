import request from '@/utils/request';

const service = 'notice';

// 修改公告信息
export function updateNotice(data) {
    return request.post(`${service}/updateNotice`, data);
}

// 查询公告信息
export function getNoticeList(data) {
    return request.get(`${service}/getNotice`, data);
}

// 获取信息详情
export function getNoticeDetail(id) {
    return request.post(`${service}/getNoticeById`, id);
}

// 删除公告信息
export function deleteNotice(id) {
    return request.post(`${service}/deleteNotice`, { id });
}

// 增加公告
export function addNotice(data) {
    return request.post(`${service}/addNotice`, data);
}