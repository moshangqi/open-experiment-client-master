import request from '@/utils/request';


export async function reqXApplyStudents(params) {
  return request('/project/getApplyingJoinInfo', {
    method: 'get',
    params,
  });
}
export async function reqXSetProjectLeader(params) {
  return request('/project/aimMemberLeader', {
    method: 'post',
    data:params,
  });
}
export async function reqXSearchStudents(params) {
  return request('/user/keyWord', {
    method: 'POST',
    params,
  });
}
export async function reqXRejectStudent(params) {
  return request('/project/rejectJoin', {
    method: 'post',
    data:params,
  });
}
export async function reqXAgreeStudent(params) {
  return request('/project/agreeJoin', {
    method: 'post',
    data:params,
  });
}
export async function reqXRemoveStudent(params) {
  return request('/project/deleteMemberFromProject', {
    method: 'post',
    requestType:'form',
    data:params,
  });
}
export async function reqXAddStudent(params) {
  return request('/project/addStudentToProject', {
    method: 'post',
    data:params,
  });
}
export async function reqXFilterStudent(params) {
  return request('/project/getApplyingJoinInfoByCondition', {
    method: 'post',
    data:params,
  });
}


