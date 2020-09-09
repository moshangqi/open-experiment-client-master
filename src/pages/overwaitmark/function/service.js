import request from '@/utils/request';


export async function getOvergetTheSchoolHasCompletedProject(payload){
  return request('/project/getTheSchoolHasCompletedProject')
}


