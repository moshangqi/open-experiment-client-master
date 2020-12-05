import {
  reqAnnouncements,
  reqAnnouncementDetail,
  reqAnnouncementDelete,
  reqAnnouncementPublish,
  reqAnnouncementSave,
  reqSavedAnnouncementPublish,
  reqAnnouncementUpdate,
  reqAnnouncementCancelPublish,
  reqAnnouncementByCondition,
  reqCollegeList,
  reqCollegeAllList,
  reqPublishAnnouncements,
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'announcement',
  state: {
    data: [],
    collegeData: [],
    isModify: false,
    detail: { title: '', content: '' },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqAnnouncements);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求出错');
      }
    },
    *fetchPublish({ payload }, { call, put }) {
      const response = yield call(reqPublishAnnouncements);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求出错');
      }
    },
    *fetchAllList({ payload }, { call, put }) {
      const response = yield call(reqCollegeAllList);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求出错');
      }
    },
    *fetchCollege({ payload }, { call, put }) {
      const response = yield call(reqCollegeList);
      if (response.code === 0) {
        yield put({
          type: 'saveCollege',
          payload: response.data,
        });
      } else {
        message.error('请求出错');
      }
    },
    *filter({ payload }, { call, put }) {
      const res = yield call(reqAnnouncementByCondition, payload);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *getDetail({ payload }, { call, put }) {
      const res = yield call(reqAnnouncementDetail, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
      } else {
        message.error('获取公告详情失败');
      }
    },
    *saveAnnouncement({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementSave, payload);
      if (res.code === 0) {
        message.success('保存成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error('保存失败');
      }
    },
    *publish({ payload }, { call, put }) {
      const role = payload.role;
      let res = yield call(reqAnnouncementPublish, payload);
      if (role == 4) {
        if (res.code === 0) {
          message.success('发布成功');
          yield put({
            type: 'fetchAllList',
          });
          let sleep = function(time) {
            let startTime = new Date().getTime() + parseInt(time, 10);
            while (new Date().getTime() < startTime) {}
          };
          sleep(10);
          window.history.back();
        } else {
          message.error('发布失败');
        }
        return;
      }
      if (res.code === 0) {
        message.success('发布成功');
        yield put({
          type: 'fetch',
        });
        let sleep = function(time) {
          let startTime = new Date().getTime() + parseInt(time, 10);
          while (new Date().getTime() < startTime) {}
        };
        sleep(10);
        window.history.back();
      } else {
        message.error('发布失败');
      }
    },
    *publishSaved({ payload }, { call, put }) {
      const role = payload.role;
      let res = yield call(reqSavedAnnouncementPublish, payload);
      if (role == 4) {
        if (res.code === 0) {
          message.success('发布成功');
          yield put({
            type: 'fetchAllList',
          });
          yield put({
            type: 'getDetail',
            payload: {
              announcementId: payload.announcementId,
            },
          });
          let sleep = function(time) {
            let startTime = new Date().getTime() + parseInt(time, 10);
            while (new Date().getTime() < startTime) {}
          };

          sleep(10);
          window.history.back();
        } else {
          message.error('发布失败');
        }
        return;
      }
      if (res.code === 0) {
        message.success('发布成功');
        yield put({
          type: 'fetch',
        });
        yield put({
          type: 'getDetail',
          payload: {
            announcementId: payload.announcementId,
          },
        });
        let sleep = function(time) {
          let startTime = new Date().getTime() + parseInt(time, 10);
          while (new Date().getTime() < startTime) {}
        };

        sleep(10);
        window.history.back();
      } else {
        message.error('发布失败');
      }
    },
    *delete({ payload }, { call, put }) {
      const role = payload.role;
      delete payload.role;
      let res = yield call(reqAnnouncementDelete, payload);
      if (role == 4) {
        if (res.code === 0) {
          message.success('删除成功');
          yield put({
            type: 'fetchAllList',
          });
        } else {
          message.error('删除失败');
        }
        return;
      }
      if (res.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error('删除失败');
      }
    },
    *cancelPublish({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementCancelPublish, payload);
      if (res.code === 0) {
        message.success('操作成功');
        yield put({
          type: 'getDetail',
          payload: {
            announcementId: payload.announcementId,
          },
        });
      } else {
        message.error('操作失败');
      }
    },
    *update({ payload }, { call, put }) {
      let res = yield call(reqAnnouncementUpdate, payload);
      if (res.code === 0) {
        message.success('操作成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error('操作失败');
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    updateIsModify(state, { payload }) {
      return { ...state, isModify: payload };
    },
    saveDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
    changeDetail(state, { payload }) {
      return { ...state, detail: { ...state.detail, ...payload } };
    },
    saveCollege(state, { payload }) {
      return { ...state, collegeData: payload };
    },
  },
};
export default Model;
