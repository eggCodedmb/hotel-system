import request from '@/utils/request';

// 文件上传
export function uploadFile(formData) {
    return request.postFormData(
        '/base/upload',
        formData,
    )
}