import request from '@/utils/request';


export async function openWays(params) {
  return request('/newCertificate/openApply', {
    method: 'POST',
    data: params,
  });
}

export async function closeWays(params) {
  return request('/newCertificate/closeApply', {
    method: 'POST',
    data: params,
  });
}

export async function emptyWays(params) {
  return request('/newCertificate/emptyTheTable');
}

export async function downloadWays(params) {
  return request('/newCertificate/downloadList',{
    responseType : 'blob'
  });
}
