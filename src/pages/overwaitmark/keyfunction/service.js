import request from '@/utils/request';


export async function getOvergetTheSchoolHasCompletedKeyProject(payload){
  return request('/project/getTheSchoolHasCompletedKeyProject')
}
