import request from '@/utils/request';

export async function reqAppendLimits(params) {
  return request('/amount/setAmount', {
    method: 'POST',
    data: params,
  });
}
export async function reqLimitList(){
  return request('/amount/getAmountLimitList')
}
export async function reqUpdateLimits(params) {
  return request('/amount/updateAmountLimit', {
    method: 'POST',
    data: params,
  });
}
