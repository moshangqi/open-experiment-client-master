import request from '@/utils/request';


export async function getCompleteKeyProject(payload){
  return request('/project/getCompleteKeyProject')
}



export async function keyWordSearchKey(data) {
  return request('/project/selectConclusionKeyProjectByKeyword', {
    method: 'post',
    data: data
  })
}
