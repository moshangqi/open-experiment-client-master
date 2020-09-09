import request from '@/utils/request';


export async function getOvercheck(payload){
  return request('/project/collegeGetsTheItemsToBeCompleted')
}

export async function stopOverProject(data) {
  return request('/project/CollegeRejectToBeConcludingProject', {
    method: 'post',
    data: data
  })
}

export async function hitBackOverProject(data) {
  return request('/project/CollegeHitBack', {
    method: 'post',
    data: data
  })
}

export async function ratingOverProject(data) {
  return request('/project/CollegeGivesRating', {
    method: 'post',
    data: data
  })
}

// export async college keyWordSearch(data) {
//   return request('/project/selectByKeyword', {
//     method: 'post',
//     data: data
//   })
// }
