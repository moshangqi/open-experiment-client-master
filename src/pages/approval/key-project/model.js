import { message } from 'antd';
import { reqReviewKeyProject, reqCollegeSetKeyScore } from './service.js';

const Model = {
  namespace: 'approvalKeyProject',
  state: {
    project: [],
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const res = yield call(reqReviewKeyProject, payload);
      console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error(`请求出错${res.msg}`);
      }
      yield put({
        type: 'loading',
        payload: false,
      });
    },
    *score({ payload }, { call, put }) {
      const res = yield call(reqCollegeSetKeyScore, payload);
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
    loading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};
export default Model;
