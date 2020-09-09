import request from '@/utils/request';


export async function getOvercheckKeyFunction(payload){
  return request('/project/getToBeConcludingKeyProject')
}

export async function stopOverProjectKeyFunction(data) {
  return request('/project/rejectToBeConcludingKeyProject', {
    method: 'post',
    data: data
  })
}

export async function hitBackOverProjectKeyFunction(data) {
  return request('/project/functionKeyProjectHitBack', {
    method: 'post',
    data: data
  })
}

export async function ratingOverProjectKeyFunction(data) {
  return request('/project/functionGivesKeyProjectRating', {
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
