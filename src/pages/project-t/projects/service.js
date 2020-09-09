import request from '@/utils/request';

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export async function reqOwnProjects(params) {
  return request('/project/getOwnProjects', {
    method: 'GET',
    params: { ...params},
  });
}
export async function reqProjectProcess(params) {
  return request('/project/getProjectDetailById', {
    method: 'GET',
    params,
  });
}
export async function reqProjectDetail(params) {
  return request('/project/getApplyInfo', {
    method: 'get',
    params
  });
}



export async function deleteNormalProject(data) {
  return request('/project/instructorsToDeleteItems', {
    method: 'post',
    data: data
  })
}

export async function deleteKeyProject(data) {
  return request('/project/deleteKeyProject', {
    method: 'post',
    data: data
  })
}


