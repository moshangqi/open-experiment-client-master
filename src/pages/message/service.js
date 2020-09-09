import request from '@/utils/request';


export async function getAllMes(payload){
  return request('/info/getAllMyMessage')
}


export async function confirmMes(params){
  return request('/info/confirmReceiptOfMidtermReminder',{
    method:'POST',
    data:params
  })
}
