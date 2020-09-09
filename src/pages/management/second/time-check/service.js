import request from '@/utils/request';

export async function reqTimeLimit(params){
  return request('/timeLimit/getTimeLimit')
}
export async function reqDeleteTimeLimit(params){
  return request('/timeLimit/deleteTimeLimit',{
    method:'get',
    params
  })
}
export async function reqSetTimeLimit(params){
  return request('/timeLimit/setTimeLimit',{
    method:'post',
    data:params
  })
}
export async function reqUpdateTimeLimit(params){
  return request('/timeLimit/updateTimeLimit',{
    method:'post',
    data:params
  })
}