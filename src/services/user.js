import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function reqUserInfo(){
  return request('/user/getMyInfo')
}
export async function reqUpdateUserInfo(params){
  return request('/user/updateUserInfo',{
    method:'post',
    data:params
  })
}
