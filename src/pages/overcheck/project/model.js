import { getOvercheck,hitBackOverProject,stopOverProject,ratingOverProject} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'over',
  state: {
    projects:[],
    project:[],
  },
  effects: {
    *collegeGetsTheItemsToBeCompleted({ payload }, { call, put }) {
      const response = yield call(getOvercheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取结题审批项目出错'+response.msg)
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
    *CollegeRejectToBeConcludingProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(stopOverProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中止项目成功');
      }
      else{
        message.error('中止项目'+res.msg)
      }
      const response = yield call(getOvercheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取结题审批项目出错'+response.msg)
      }
    },

    *CollegeGivesRating({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(ratingOverProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('评级成功');
      }
      else{
        message.error('评级出错'+res.msg)
      }
      const response = yield call(getOvercheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取结题审批项目出错'+response.msg)
      }
    },

    *CollegeHitBack({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(hitBackOverProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('结题退回修改项目成功');
      }
      else{
        message.error('结题退回修改项目'+res.msg)
      }
      const response = yield call(getOvercheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取结题审批项目出错'+response.msg)
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return { ...state, projects: payload };
    },
  },
};
export default Model;
