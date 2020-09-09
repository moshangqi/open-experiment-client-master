import request from '@/utils/request';


export async function getMidcheck(payload){
  return request('/project/getIntermediateInspectionProject')
}

export async function stopProject(data) {
  return request('/project/rejectIntermediateInspectionProject', {
    method: 'post',
    data: data
  })
}

export async function hitBackProject(data) {
  return request('/project/midTermKeyProjectHitBack', {
    method: 'post',
    data: data
  })
}

export async function keyWordSearch(data) {
  return request('/project/selectByKeyword', {
    method: 'post',
    data: data
  })
}
