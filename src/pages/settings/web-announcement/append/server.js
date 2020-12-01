import request from '@/utils/request';

export const reqUploadImage = (params) => {
  return request('/file/uploadNewsImages',{
    method: 'POST',
    data: params
  })
}