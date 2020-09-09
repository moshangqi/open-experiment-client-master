import { addRule, queryRule, removeRule, updateRule ,reqLabKeyProjects} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'labKeyProjects',
  state: {
    labProjects:[],
    tabActiveKey:'0'
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(reqLabKeyProjects, payload);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('请求审批项目出错')
      }
      
    },
  },
  reducers: {
    save(state, {payload}) {
      return { ...state, labProjects: payload };
    },
    changeTabActiveKey(state,{payload}){
      return {...state,tabActiveKey:payload}
    }
  },
};
export default Model;
