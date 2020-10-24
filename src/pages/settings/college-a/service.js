import request from '@/utils/request';

export async function reqApprovalRole() {
  return request('/permission/getCollegeUserInfoByCollege');
}

export async function reqAddRole(params) {
  return request('/permission/addUserRole', {
    method: 'POST',
    data: params,
  });
}

export async function reqDeleteRole(params) {
  return request('/permission/deleteUserRole', {
    method: 'POST',
    data: params,
  });
}
