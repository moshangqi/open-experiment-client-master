import request from '@/utils/request';

export async function reqAddRole(params) {
  return request('/permission/addUserRole', {
    method: 'POST',
    data: params,
  });
}
export async function reqRoleList(){
  return request('/permission/getUserInfoByRole')
}
export async function reqRemoveRole(params){
  return request('/permission/deleteUserRole',{
    method:'post',
    data:params
  })
}
