import { getReturnProject,noHitProject,yesHitProject} from './service';
import { message } from 'antd';


const Model = {
  namespace: 'hitproject',
  state: {
    projects:[],
  },
  effects: {
    *getMidTermReturnProject({ payload }, { call, put }) {
      const response = yield call(getReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期复核审批项目出错'+response.msg)
      }

    },



    *rejectIntermediateInspectionProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(noHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期退回项目复核不通过');
      }
      else{
        message.error('中期退回项目复核出错'+res.msg)
      }
      const response = yield call(getReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期复核审批项目出错'+response.msg)
      }
    },

    *midTermReviewPassed({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(yesHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期退回项目复核通过');
      }
      else{
        message.error('中期退回项目复核出错'+res.msg)
      }
      const response = yield call(getReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期复核审批项目出错'+response.msg)
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
