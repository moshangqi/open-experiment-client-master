import request from '@/utils/request';


export async function getOvercheckFunction(payload){
  return request('/project/getToBeConcludingProject')
}

export async function stopOverProjectFunction(data) {
  return request('/project/rejectToBeConcludingProject', {
    method: 'post',
    data: data
  })
}

export async function hitBackOverProjectFunction(data) {
  return request('/project/functionHitBack', {
    method: 'post',
    data: data
  })
}

export async function ratingOverProjectFunction(data) {
  return request('/project/functionGivesRating', {
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
