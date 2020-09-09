import request from '@/utils/request';


export async function getCollegeReturnProject(payload){
  return request('/project/getCollegeReturnProject',{
    method:'POST',
  })
}

export async function noCollegeHitProject(data) {
  return request('/project/CollegeRejectToBeConcludingProject', {
    method: 'post',
    data: data
  })
}

export async function yesCollegeHitProject(data) {
  return request('/project/CollegeReviewPassed', {
    method: 'post',
    data: data
  })
}
