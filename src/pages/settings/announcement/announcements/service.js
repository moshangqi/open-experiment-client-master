import request from '@/utils/request';
import { Alert } from 'antd';
import { ANT_MARK } from 'antd/lib/locale-provider';

export async function reqAnnouncements() {
  return request('/announcement/list');
}

export async function reqPublishAnnouncements() {
  return request('/announcement/getList');
}

export async function reqCollegeAllList() {
  return request('/announcement/collegeList');
}

export async function reqCollegeList() {
  return request('/announcement/getCollegeList');
}

export async function reqAnnouncementDetail(payload) {
  return request('/announcement/readDetail', {
    method: 'get',
    params: payload,
  });
}
export async function reqAnnouncementSave(payload) {
  if (payload.role === 4) {
    delete payload.role;
    return request('/announcement/createCollegeAndSave', {
      method: 'post',
      data: payload,
    });
  }
  delete payload.role;
  return request('/announcement/createAndSave', {
    method: 'post',
    data: payload,
  });
}
export async function reqAnnouncementDelete(payload) {
  return request('/announcement/delete', {
    method: 'get',
    params: payload,
  });
}
export async function reqAnnouncementPublish(payload) {
  console.log(payload);
  if (payload.role === 4) {
    delete payload.role;
    return request('/announcement/collegePublish', {
      method: 'post',
      data: payload,
    });
  }
  delete payload.role;
  return request('/announcement/publish', {
    method: 'post',
    data: payload,
  });
}
export async function reqSavedAnnouncementPublish(payload) {
  return request('/announcement/publishSavedAnnouncement', {
    method: 'get',
    params: payload,
  });
}
export async function reqAnnouncementUpdate(payload) {
  delete payload.role;
  return request('/announcement/update', {
    method: 'post',
    data: payload,
  });
}
export async function reqAnnouncementCancelPublish(payload) {
  return request('/announcement/cancelPublish', {
    method: 'get',
    params: payload,
  });
}
export async function reqAnnouncementByCondition(payload) {
  return request('/announcement/queryByCondition', {
    method: 'post',
    data: payload,
  });
}
