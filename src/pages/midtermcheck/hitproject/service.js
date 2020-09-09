import request from '@/utils/request';


export async function getReturnProject(payload){
  return request('/project/getMidTermReturnProject',{
    method:'POST',
  })
}

export async function noHitProject(data) {
  return request('/project/rejectIntermediateInspectionProject', {
    method: 'post',
    data: data
  })
}

export async function yesHitProject(data) {
  return request('/project/midTermReviewPassed', {
    method: 'post',
    data: data
  })
}
