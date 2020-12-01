import request from '@/utils/request';
const projectsUrl = [
  '/project/getPendingApprovalProjectBySecondaryUnit',
  '/project/getToBeReportedProjectBySecondaryUnit',
  '/project/getHistoricalProjectInfoByUnitAndOperation',
  '/project/getHistoricalProjectInfoByUnitAndOperation',
  '/project/getToReviewProject'
];

export async function reqSecondProjects(payload) {
  console.log(projectsUrl[payload.status], payload.status, payload);
  if(payload.status == 4) {
    return request(projectsUrl[payload.status], {
      method: 'get'
    })
  }
  return request(projectsUrl[payload.status], {
    method: +payload.status <= 1 ? 'get' : 'post',
    data: payload.data,
  });
}
export async function reqUpdateFunds(params) {
  return request('/funds/updateProjectApplyFundsBySecondaryUnit', {
    method: 'POST',
    data: params,
  });
}
export async function reqExportApplyExcel() {
  return request('/file/generateEstablishExcel', {
    method: 'POST',
    responseType: 'blob',
  });
}
export async function reqExportProjectInfoExcel() {
  return request('/file/generateProjectInfoExcel', {
    method: 'POST',
    responseType: 'blob',
  });
}
