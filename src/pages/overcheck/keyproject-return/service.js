import request from '@/utils/request';


export async function getCollegeReturnKeyProject(payload){
  return request('/project/getCollegeReturnKeyProject')
}

export async function noCollegeHitKeyProject(data) {
  return request('/project/rejectCollegeKeyProject', {
    method: 'post',
    data: data
  })
}

export async function yesCollegeHitKeyProject(data) {
  return request('/project/collegeReviewPassed', {
    method: 'post',
    data: data
  })
}
