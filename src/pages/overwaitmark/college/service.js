import request from '@/utils/request';

export async function getOvercollegeGetsTheProjects(payload) {
  return request('/project/collegeGetsTheProjects');
}

export async function reqExportExcel(payload) {
  return request('/file/generateConclusionExcel', {
    method: 'POST',
    responseType: 'blob',
  });
}
