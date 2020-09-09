import { addRule, queryRule, removeRule, updateRule ,reqLabProjects,reqLabKeyProjects} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'lab2',
  state: {
    labProjects:[],
    tabActiveKey:'0'
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      console.log(payload)
      const response = payload.projectType===2?yield call(reqLabKeyProjects,payload):yield call(reqLabProjects, payload);
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
