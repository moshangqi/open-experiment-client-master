import { message } from 'antd';
import { reqApprovalList, reqAddApproval, reqDeleteApproval } from './service';

const Model = {
  namespace: 'firstApproval',
  state: {
    approvalList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(reqApprovalList, payload);
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error(`请求出错${res.msg}`);
      }
      // if(res.code===0)
      //   yield put({
      //     type:'save',
      //     payload:res.data
      //   })
      // else{
      //   message.error(`请求出错${res.msg}`)
      // }
    },
    *add({ payload }, { call, put }) {
      const res = yield call(reqAddApproval, payload);
      if (res.code === 0) {
        console.log(res.data);
        yield put({
          type: 'saveAdd',
          payload: res.data,
        });
      } else {
        message.error(`请求出错${res.msg}`);
      }
    },

    *delete({ payload }, { call, put }) {
      const res = yield call(reqDeleteApproval, payload);
      console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'saveDelete',
          payload: payload,
        });
      } else {
        message.error(`请求出错${res.msg}`);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, approvalList: payload };
    },
    saveAdd(state, { payload }) {
      return { ...state, approvalList: [...state.approvalList, ...payload] };
    },
    saveDelete(state, { payload }) {
      return { ...state, approvalList: state.approvalList.filter(item => item.id !== payload.id) };
    },
  },
};
export default Model;
