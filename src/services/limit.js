import request from '@/utils/request';
export async function reqAmountLimit(params){
  return request('/amount/getAmountLimitVOListByCollegeAndProjectType',{
    method:'get',
    params
  })
}