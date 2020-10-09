import { message } from 'antd';
import { reqReviewProjectList, reqCollegeSetScore } from './service.js';

const Model = {
  namespace: 'approvalProject',
  state: {
    project: [],
    loading: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(reqReviewProjectList, payload);
      if (res.code === 0)
        yield put({
          type: 'save',
          payload: res.data,
        });
      else {
        message.error(`请求出错${res.msg}`);
      }
      //window.location.href
    },
    *score({ payload }, { call, put }) {
      const res = yield call(reqCollegeSetScore, payload);
      console.log(res);
      if (res.code === 0) {
        message.success('打分成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error(`请求出错${res.msg}`);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, project: payload };
    },
  },
};
export default Model;
