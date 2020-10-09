import request from '@/utils/request';
import axios from 'axios';

export async function reqApprovalList() {
  return request('/collegeReview/getCollegeReview');
}

export async function reqAddApproval(params) {
  return request('/collegeReview/collegeSetUpReview', {
    method: 'POST',
    data: params,
  });
}

export async function reqDeleteApproval(params) {
  return request('/collegeReview/deleteCollegeReview', {
    method: 'post',
    params: params,
  });
}
