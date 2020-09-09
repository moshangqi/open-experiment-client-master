import request from '@/utils/request';


export async function reqApproval(url,data) {
  return request(url, {
    method: 'POST',
    data,
  });
}
export async function reqKeyApply(params){
  return request('/project/createKeyApply',{
    method:'post',
    data:params
  })
}