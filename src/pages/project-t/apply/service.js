import request from '@/utils/request';

export async function reqApplyForm(params) {
  return request('/project/createApply', {
    method: 'POST',
    data: params,
  });
}
export async function reqSearchStudents(params) {
  return request('/user/keyWord', {
    method: 'POST',
    params,
  });
}
