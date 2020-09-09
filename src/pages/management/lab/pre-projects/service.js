import request from '@/utils/request';
const projectsUrl = ['/project/getPendingApprovalProjectByLabAdministrator','/project/getToBeReportedProjectByLabLeader','/project/getHistoricalProjectInfoByUnitAndOperation','/project/getHistoricalProjectInfoByUnitAndOperation','/project/getHistoricalProjectInfoByUnitAndOperation']


export async function reqLabProjects(payload) {
  return request(projectsUrl[payload.status],{
    method:+payload.status<=1?'get':'post',
    data:payload.data
  })
}
