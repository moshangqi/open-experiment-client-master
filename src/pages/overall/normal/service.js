import request from '@/utils/request';


export async function getConclusionProject(payload){
  return request('/project/getConclusionProject')
}



export async function keyWordSearchKey(data) {
  return request('/project/selectConclusionByKeyword', {
    method: 'post',
    data: data
  })
}
