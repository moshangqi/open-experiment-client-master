import request from '@/utils/request';


export async function getMidKeycheck(payload){
  return request('/project/getIntermediateInspectionKeyProject')
}


export async function stopKeyProject(data) {
  return request('/project/rejectIntermediateInspectionKeyProject', {
    method: 'post',
    data: data
  })
}



export async function hitBackKeyProject(data) {
  return request('/project/KeyProjectMidTermKeyProjectHitBack', {
    method: 'post',
    data: data
  })
}

export async function keyWordSearchKey(data) {
  return request('/project/selectKeyProjectByKeyword', {
    method: 'post',
    data: data
  })
}

