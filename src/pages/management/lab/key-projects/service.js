import request from '@/utils/request';
const keyProjectsUrl = {
  '0':'/project/getKeyProjectApplyingListByLabAdmin',
  '1':'/project/getToBeReportedKeyProjectByLabAdmin',
  '2':'/project/getHistoricalKeyProjectInfo',
  '3':'/project/getHistoricalKeyProjectInfo',
  '4': '/project/getToReviewKeyProject '
}

export async function reqLabKeyProjects(payload) {
  if(payload.status == 4) {
    return request(keyProjectsUrl[payload.status],{
      method: 'get'
    })
  }
  return request(keyProjectsUrl[payload.status],{
    method:+payload.status<=1?'get':'post',
    data:payload.data
  })
}