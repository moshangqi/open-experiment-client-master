import request from '@/utils/request';

export async function reqUpdateApply(params) {
  return request('/project/updateApply', {
    method: 'POST',
    data: params,
  });
}
