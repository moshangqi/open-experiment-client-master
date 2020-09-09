import request from '@/utils/request';

export async function certificateApply(params) {
  return request('/newCertificate/applyCertificate', {
    method: 'POST',
    data: params,
  });
}

export async function myApplication(params) {
  return request('/newCertificate/viewMyApplication', {
    method: 'POST',
    data: params,
  });
}

export async function deleteApplication(params) {
  return request('/newCertificate/deleteMyApplication', {

    method: 'POST',
    data: params,
  });
}
