import request from '@/utils/request';


export async function reqApplyStudents(params) {
  return request('/project/getApplyingJoinInfo', {
    method: 'get',
    params,
  });
}
export async function reqSetProjectLeader(params) {
  return request('/project/aimMemberLeader', {
    method: 'post',
    data:params,
  });
}
export async function reqSearchStudents(params) {
  return request('/user/keyWord', {
    method: 'POST',
    params,
  });
}
export async function reqRejectStudent(params) {
  return request('/project/rejectJoin', {
    method: 'post',
    data:params,
  });
}
export async function reqAgreeStudent(params) {
  return request('/project/agreeJoin', {
    method: 'post',
    data:params,
  });
}
export async function reqRemoveStudent(params) {
  return request('/project/deleteMemberFromProject', {
    method: 'post',
    requestType:'form',
    data:params,
  });
}
export async function reqAddStudent(params) {
  return request('/project/addStudentToProject', {
    method: 'post',
    data:params,
  });
}
export async function reqFilterStudent(params) {
  return request('/project/getApplyingJoinInfoByCondition', {
    method: 'post',
    data:params,
  });
}


