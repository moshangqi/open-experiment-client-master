import { getMidcheck,stopProject,hitBackProject,keyWordSearch} from './service';
import { message } from 'antd';
import {deleteApplication} from "@/pages/certificate/stu-certificate/service";

const Model = {
  namespace: 'mid',
  state: {
    projects:[],
    project:[],
  },
  effects: {
    *getIntermediateInspectionProject({ payload }, { call, put }) {
      const response = yield call(getMidcheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期审批项目出错'+response.msg)
      }

    },

    *selectByKeyword({ payload }, { call, put }) {
      const {data} = payload;
      const response = yield call(keyWordSearch, data);
      console.log(response);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('搜索中期审批项目出错'+response.msg)
      }

    },

    *rejectIntermediateInspectionProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(stopProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期中止项目成功');
      }
      else{
        message.error('中期中止项目'+res.msg)
      }
      const response = yield call(getMidcheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期审批项目出错'+response.msg)
      }
    },

    *midTermKeyProjectHitBack({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(hitBackProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期退回修改项目成功');
      }
      else{
        message.error('中期退回修改项目'+res.msg)
      }
      const response = yield call(getMidcheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期审批项目出错'+response.msg)
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
