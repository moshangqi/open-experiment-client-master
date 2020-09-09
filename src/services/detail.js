import request from '@/utils/request';


export async function reqOwnProjects(params) {
  return request('/project/getOwnProjects', {
    method: 'GET',
    data: { ...params},
  });
}
export async function reqProjectProcess(params) {
  return request('/project/getProjectDetailById', {
    method: 'GET',
    params,
  });
}
export async function reqKeyProjectProcess(params) {
  return request('/project/getKeyProjectDetailById', {
    method: 'GET',
    params,
  });
}
export async function reqProjectDetail(params) {
  return request('/project/getConclusionInfo', {
    method: 'get',
    params
  });
}
export async function reqUploadApplyFile(params) {
  return request('/file/reloadApplyDoc', {
    method: 'post',
    data:params
  });
}

export async function reqUploadOverFile(params) {
  return request('/file/uploadConcludingReport', {
    method: 'post',
    data:params
  });
}

export async function reqUploadZipFile(params) {
  return request('/file/uploadAchievementAnnex', {
    method: 'post',
    data:params
  });
}

export async function reqUploadEquipmentFile(params) {
  return request('/file/uploadExperimentReport', {
    method: 'post',
    data:params
  });
}



export async function reqUploadAttFile(params) {
  return request('/file/uploadAttachmentFile', {
    method: 'post',
    data:params
  });
}

export async function deleteFile(data) {
  return request('/file/deleteFile', {
    method: 'post',
    data:data
  });
}

export async function deleteOutCome(data) {
  return request('/project/deleteIconicResult', {
    method: 'post',
    data:data
  });
}

export async function reqNewOut(params) {
  return request('/project/insertIconicResult', {
    method: 'post',
    data:params
  });
}



