import request from '@/utils/request';


export async function getOvercollegeGetsTheProjects(payload){
  return request('/project/collegeGetsTheProjects')
}


