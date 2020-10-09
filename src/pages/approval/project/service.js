import request from '@/utils/request';

export async function reqReviewProjectList() {
  console.log('nima1');
  return request('/project/getToReviewProject');
}

export async function reqCollegeSetScore(params) {
  return request('/project/collegeSetScore', {
    method: 'POST',
    data: params,
  });
}
