import request from '@/utils/request';

export async function reqEquipmentProjects(payload) {
  return request('/project/getPendingApprovalProjectByFunctionalDepartment');
}
export async function reqExportConclusionExcel() {
  return request('/file/generateAllEstablishExcel', {
    // /generateConclusionExcel 修改下载接口
    method: 'POST',
    responseType: 'blob',
  });
}
export async function reqfilterProjects(params) {
  return request('/project/conditionallyQueryOfProject', {
    method: 'post',
    data: params,
  });
}
export async function reqRejectedProjects(params) {
  // '/project/getHistoricalProjectInfoByUnitAndOperation' 未知的打回展示不用先注释,好像是已经审批的，现在移到reqResolveProject
  return request('/project/getEstablishReturnProject', {
    method: 'post',
    data: params,
  });
}
export async function reqEquipmentKeyProjects(params) {
  return request('/project/getKeyProjectApplyingListByFunctionalDepartment');
}

export async function reqHitBcak(params) {
  return request('/project/establishProjectHitBack', {
    method: 'post',
    data: params,
  });
}

export async function reqReviewPassed(params) {
  return request('/project/establishReviewPassed', {
    method: 'post',
    data: params,
  });
}

export async function reqResolveProject(params) {
  return request('/project/getHistoricalProjectInfoByUnitAndOperation', {
    method: 'post',
    data: params,
  });
}

export async function reqAgree(params) {
  return request('/project/agreeEstablish', {
    method: 'post',
    data: params,
  });
}

export async function reqReject(params) {
  return request('/project/rejectProjectApplyByFunctionalDepartment', {
    method: 'post',
    data: params,
  });
}
