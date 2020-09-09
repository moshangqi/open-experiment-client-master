import { getMidKeycheck,stopKeyProject,hitBackKeyProject,keyWordSearchKey} from './service';
import { message } from 'antd';
import {getMidcheck, hitBackProject, keyWordSearch} from "@/pages/midtermcheck/service";

const Model = {
  namespace: 'midKey',
  state: {
    projects:[],
  },
  effects: {
    *getIntermediateInspectionKeyProject({ payload }, { call, put }) {
      const response = yield call(getMidKeycheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期审批项目出错'+response.msg)
      }

    },

    *keyWordSearchKey({ payload }, { call, put }) {
      const {data} = payload;
      const response = yield call(keyWordSearchKey, data);
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

    *rejectIntermediateInspectionKeyProject({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(stopKeyProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期中止项目成功');
      }
      else{
        message.error('中期中止项目'+res.msg)
      }
      const response = yield call(getMidKeycheck, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取中期审批项目出错'+response.msg)
      }
    },

    *KeyProjectMidTermKeyProjectHitBack({ payload }, { call,put }) {
      const {data} = payload;
      const res  = yield call(hitBackKeyProject, data);
      console.log(res);
      if(res.code===0) {
        message.success('中期退回修改项目成功');
      }
      else{
        message.error('中期退回修改项目'+res.msg)
      }
      const response = yield call(getMidKeycheck, payload);
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
    }
  },
};
export default Model;
