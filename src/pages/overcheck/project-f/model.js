import {
  getOvercheckFunction,
  hitBackOverProjectFunction,
  stopOverProjectFunction,
  ratingOverProjectFunction,
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'overfunction',
  state: {
    projects: [],
    project: [],
  },
  effects: {
    *getToBeConcludingProject({ payload }, { call, put }) {
      const response = yield call(getOvercheckFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },

    // *selectByKeyword({ payload }, { call, put }) {
    //   const {data} = payload;
    //   const response = yield call(keyWordSearch, data);
    //   console.log(response);
    //   if(response.code===0){
    //     yield put({
    //       type: 'save',
    //       payload: response.data,
    //     });
    //   }else{
    //     message.error('搜索中期审批项目出错'+response.msg)
    //   }
    //
    // },
    //
    *rejectToBeConcludingProject({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(stopOverProjectFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('中止项目成功');
      } else {
        message.error('中止项目' + res.msg);
      }
      const response = yield call(getOvercheckFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },

    *FunctionGivesRating({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(ratingOverProjectFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('职能部门通过成功');
      } else {
        message.error('职能部门通过出错' + res.msg);
      }
      const response = yield call(getOvercheckFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },

    *functionHitBack({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(hitBackOverProjectFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('结题退回修改项目成功');
      } else {
        message.error('结题退回修改项目' + res.msg);
      }
      const response = yield call(getOvercheckFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, projects: payload };
    },
  },
};
export default Model;
