import request from '@/utils/request';

export async function reqEquipmentKeyProjects(payload) {
  return request('/project/getKeyProjectApplyingListByFunctionalDepartment');
}
export async function reqExportConclusionExcel() {
  return request('/file/generateConclusionExcel', {
    method: 'POST',
    responseType: 'blob',
  });
}
export async function reqFilter(params) {
  return request('/project/conditionallyQueryOfKeyProject', {
    method: 'post',
    data: params,
  });
}
export async function reqRejectedKeyProjects(params) {
  return request('/project/getHistoricalKeyProjectInfo', {
    method: 'post',
    data: params,
  });
}

export async function reqKeytoNormalProject(params) {
  return request('/project/changeKeyProjectToGeneral', {
    method: 'post',
    data: params,
  });
}

export async function reqHitBackKeyProject(params) {
  return request('/project/keyProjectEstablishHitBack', {
    method: 'post',
    data: params,
  });
}

export async function reqReturnKeyProject(params) {
  return request('/project/getKeyProjectEstablishReturnProject', {
    method: 'post',
  });
}

export async function reqReviewPassed(params) {
  return request('/project/keyProjectEstablishReviewPassed', {
    method: 'post',
    data: params,
  });
}
