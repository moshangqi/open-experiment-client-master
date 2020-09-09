import request from '@/utils/request';


export async function reqEquipmentProjects(payload){
  return request('/project/getPendingApprovalProjectByFunctionalDepartment')
}
export async function reqExportConclusionExcel() {
  return request('/file/generateConclusionExcel', {
    method: 'POST',
    responseType:'blob'
  });
}
export async function reqfilterProjects(params){
  return request('/project/conditionallyQueryOfProject',{
    method:'post',
    data:params
  })

}
export async function reqRejectedProjects(params){
  return request('/project/getHistoricalProjectInfoByUnitAndOperation',{
    method:'post',
    data:params
  })

}
export async function reqEquipmentKeyProjects(params){
  return request('/project/getKeyProjectApplyingListByFunctionalDepartment')
}
