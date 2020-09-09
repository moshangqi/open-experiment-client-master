import { getCollegeReturnProject,noCollegeHitProject,yesCollegeHitProject} from './service';
import { message } from 'antd';


const Model = {
  namespace: 'overcollegereturn',
  state: {
    projects:[],
  },
  effects: {
    *getCollegeReturnProject({ payload }, { call, put }) {
      const response = yield call(getCollegeReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取学院复核审批项目出错'+response.msg)
      }

    },



    *CollegeRejectToBeConcludingProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(noCollegeHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('结题退回项目学院复核不通过');
      }
      else{
        message.error('结题退回项目学院复核出错'+res.msg)
      }
      const response = yield call(getCollegeReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取复核审批项目出错'+response.msg)
      }
    },

    *CollegeReviewPassed({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(yesCollegeHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('结题退回项目学院复核通过');
      }
      else{
        message.error('结题退回项目学院复核出错'+res.msg)
      }
      const response = yield call(getCollegeReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取复核审批项目出错'+response.msg)
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return { ...state, projects: payload };
    }
  },
};
export default Model;
