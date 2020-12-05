import { reqCanApplyProjects, reqfilterProjects, getTips } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'openProjects',
  state: {
    projects: [],
    messageLength: false,
  },
  effects: {
    *fetchProjects(_, { call, put }) {
      const response = yield call(reqCanApplyProjects);
      yield put({
        type: 'saveProjects',
        payload: response.data,
      });
    },

    *getMessageTips({ payload }, { call, put }) {
      const response = yield call(getTips, payload);
      yield put({
        type: 'saveMessageLength',
        payload: response.data.length > 0 ? true : false,
      });
      if (response.data.length !== 0) {
        message.info('您有' + response.data.length + '条消息，请前往消息中心查看并确认');
      }
    },

    *filter({ payload }, { call, put }) {
      const res = yield call(reqfilterProjects, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveProjects',
          payload: res.data,
        });
      } else {
        message.error('查询失败');
      }
    },
  },
  reducers: {
    saveProjects(state, { payload }) {
      console.log({ ...state, projects: payload });
      return { ...state, projects: payload };
    },
    saveMessageLength(state, { payload }) {
      console.log(state, payload);
      return { ...state, messageLength: payload };
    },
  },
};
export default Model;
