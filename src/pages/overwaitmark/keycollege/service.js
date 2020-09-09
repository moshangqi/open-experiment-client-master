import request from '@/utils/request';


export async function getOvergetTheCollegeHasCompletedKeyProject(payload){
  return request('/project/getTheCollegeHasCompletedKeyProject')
}
