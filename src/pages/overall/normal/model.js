import { getConclusionProject,keyWordSearchKey} from './service';
import { message } from 'antd';
import {getMidcheck, hitBackProject, keyWordSearch} from "@/pages/midtermcheck/service";

const Model = {
  namespace: 'overfunctionall',
  state: {
    projects:[],
  },
  effects: {
    *getConclusionProject({ payload }, { call, put }) {
      const response = yield call(getConclusionProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取项目出错'+response.msg)
      }

    },

    *selectConclusionByKeyword({ payload }, { call, put }) {
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
