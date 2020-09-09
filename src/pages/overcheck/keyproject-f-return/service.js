import request from '@/utils/request';


export async function getFunctionReturnKeyProject(payload){
  return request('/project/getFunctionReturnKeyProject')
}

export async function noFunctionHitKeyProject(data) {
  return request('/project/rejectToBeConcludingKeyProject', {
    method: 'post',
    data: data
  })
}

export async function yesFunctionHitKeyProject(data) {
  return request('/project/functionReviewPassedKeyProject', {
    method: 'post',
    data: data
  })
}
