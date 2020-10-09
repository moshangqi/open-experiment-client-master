import request from '@/utils/request';

export async function reqReviewKeyProject() {
  return request('/project/getToReviewKeyProject');
}

export async function reqCollegeSetKeyScore(params) {
  return request('/project/collegeSetKeyScore', {
    method: 'POST',
    data: params,
  });
}
