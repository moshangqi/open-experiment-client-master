import {
  getOvercheckKeyFunction,
  hitBackOverProjectKeyFunction,
  stopOverProjectKeyFunction,
  ratingOverProjectKeyFunction,
} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'overkeyfunction',
  state: {
    projects: [],
    project: [],
  },
  effects: {
    *getToBeConcludingKeyProject({ payload }, { call, put }) {
      const response = yield call(getOvercheckKeyFunction, payload);
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
    *rejectToBeConcludingKeyProject({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(stopOverProjectKeyFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('中止项目成功');
      } else {
        message.error('中止项目' + res.msg);
      }
      const response = yield call(getOvercheckKeyFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },

    *functionGivesKeyProjectRating({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(ratingOverProjectKeyFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('职能部门通过重点项目成功');
      } else {
        message.error('职能部门通过重点出错' + res.msg);
      }
      const response = yield call(getOvercheckKeyFunction, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('获取结题审批项目出错' + response.msg);
      }
    },

    *functionKeyProjectHitBack({ payload }, { call, put }) {
      const { data } = payload;
      const res = yield call(hitBackOverProjectKeyFunction, data);
      console.log(res);
      if (res.code === 0) {
        message.success('结题退回修改重点项目成功');
      } else {
        message.error('结题退回修改重点项目' + res.msg);
      }
      const response = yield call(getOvercheckKeyFunction, payload);
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
