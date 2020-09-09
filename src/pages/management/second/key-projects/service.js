import request from '@/utils/request';
const keyProjectsUrl = {
  '0':'/project/getKeyProjectApplyingListBySecondaryUnit',
  '1':'/project/getToBeReportedKeyProjectBySecondaryUnit',
  '2':'/project/getHistoricalKeyProjectInfo',
  '3':'/project/getHistoricalKeyProjectInfo'
}

export async function reqSecondProjects(payload) {
  return request(projectsUrl[payload.status])
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
    responseType:'blob'
  });
}
export async function reqSecondKeyProjects(payload) {
  return request(keyProjectsUrl[payload.status],{
    method:+payload.status<=1?'get':'post',
    data:payload.data
  })
}