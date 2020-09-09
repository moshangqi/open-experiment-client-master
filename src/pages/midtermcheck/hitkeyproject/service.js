import request from '@/utils/request';


export async function getReturnKeyProject(payload){
  return request('/project/getKeyProjectMidTermReturnProject',{
    method:'POST',
  })
}

export async function noHitKeyProject(data) {
  return request('/project/rejectIntermediateInspectionKeyProject', {
    method: 'post',
    data: data
  })
}

export async function yesHitKeyProject(data) {
  return request('/project/KeyProjectMidTermReviewPassed', {
    method: 'post',
    data: data
  })
}
