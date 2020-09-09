import request from '@/utils/request';



export async function reqJoin(params) {
  return request('/project/joinApply', {
    method: 'POST',
    data: params,
  });
}
export async function reqProjects(params) {
  return request('/project/getOwnProjects', {
    method: 'get',
    params,
  });
}