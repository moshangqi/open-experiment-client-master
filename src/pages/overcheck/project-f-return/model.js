import { getFunctionReturnProject,noFunctionHitProject,yesFunctionHitProject} from './service';
import { message } from 'antd';


const Model = {
  namespace: 'overfunctionreturn',
  state: {
    projects:[],
  },
  effects: {
    *getFunctionReturnProject({ payload }, { call, put }) {
      const response = yield call(getFunctionReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取职能部门复核审批项目出错'+response.msg)
      }

    },



    *rejectToBeConcludingProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(noFunctionHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('结题退回项目复核不通过');
      }
      else{
        message.error('结题退回项目复核出错'+res.msg)
      }
      const response = yield call(getFunctionReturnProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取复核审批项目出错'+response.msg)
      }
    },

    *functionReviewPassed({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(yesFunctionHitProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('结题退回项目复核通过');
      }
      else{
        message.error('结题退回项目复核出错'+res.msg)
      }
      const response = yield call(getFunctionReturnProject, payload);
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
