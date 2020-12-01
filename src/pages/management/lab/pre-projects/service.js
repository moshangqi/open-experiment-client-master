import request from '@/utils/request';
const projectsUrl = ['/project/getPendingApprovalProjectByLabAdministrator','/project/getToBeReportedProjectByLabLeader','/project/getHistoricalProjectInfoByUnitAndOperation','/project/getHistoricalProjectInfoByUnitAndOperation','/project/getHistoricalProjectInfoByUnitAndOperation']


export async function reqLabProjects(payload) {
  if(payload.status == 4) {
    return request('/project/getToReviewProject',{
      method: 'get'
    })
  }
  return request(projectsUrl[payload.status],{
    method:+payload.status<=1?'get':'post',
    data:payload.data
  })
}
