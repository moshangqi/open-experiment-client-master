import request from '@/utils/request';


export async function getFunctionReturnProject(payload){
  return request('/project/getFunctionReturnProject',{
    method:'POST',
  })
}

export async function noFunctionHitProject(data) {
  return request('/project/rejectToBeConcludingProject', {
    method: 'post',
    data: data
  })
}

export async function yesFunctionHitProject(data) {
  return request('/project/functionReviewPassed', {
    method: 'post',
    data: data
  })
}
