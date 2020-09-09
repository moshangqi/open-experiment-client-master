import request from '@/utils/request';


export async function reqEquipmentKeyProjects(payload){
  return request('/project/getKeyProjectApplyingListByFunctionalDepartment')
}
export async function reqExportConclusionExcel() {
  return request('/file/generateConclusionExcel', {
    method: 'POST',
    responseType:'blob'
  });
}
export async function reqFilter(params){
  return request('/project/conditionallyQueryOfKeyProject',{
    method: 'post',
    data:params
  })
}
export async function reqRejectedKeyProjects(params){
  return request('/project/getHistoricalKeyProjectInfo',{
    method:'post',
    data:params
  })

}