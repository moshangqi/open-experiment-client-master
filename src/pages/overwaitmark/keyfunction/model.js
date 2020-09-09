import { getOvergetTheSchoolHasCompletedKeyProject} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'overkeyfunctionpass',
  state: {
    projects:[],
  },
  effects: {
    *getTheSchoolHasCompletedKeyProject({ payload }, { call, put }) {
      const response = yield call(getOvergetTheSchoolHasCompletedKeyProject, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取项目出错'+response.msg)
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
