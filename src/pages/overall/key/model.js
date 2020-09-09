import { getCompleteKeyProject,keyWordSearchKey} from './service';
import { message } from 'antd';
import {getMidcheck, hitBackProject, keyWordSearch} from "@/pages/midtermcheck/service";

const Model = {
  namespace: 'overfunctionallkey',
  state: {
    projects:[],
  },
  effects: {
    *getCompleteKeyProject({ payload }, { call, put }) {
      const response = yield call(getCompleteKeyProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取项目出错'+response.msg)
      }

    },

    *selectConclusionKeyProjectByKeyword({ payload }, { call, put }) {
      const {data} = payload;
      const response = yield call(keyWordSearchKey, data);
      console.log(response);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('搜索项目出错'+response.msg)
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
