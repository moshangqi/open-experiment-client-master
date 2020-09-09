import request from '@/utils/request';


export async function getOverKeycheck(payload){
  return request('/project/getCollegeKeyProject')
}

export async function stopOverKeyProject(data) {
  return request('/project/rejectCollegeKeyProject', {
    method: 'post',
    data: data
  })
}

export async function hitBackOverKeyProject(data) {
  return request('/project/collegeKeyProjectHitBack', {
    method: 'post',
    data: data
  })
}

export async function ratingOverKeyProject(data) {
  return request('/project/collegeGivesKeyProjectRating', {
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
