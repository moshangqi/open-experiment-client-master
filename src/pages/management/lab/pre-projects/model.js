import { addRule, queryRule, removeRule, updateRule ,reqLabProjects} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'lab',
  state: {
    labProjects:[],
    tabActiveKey:'1',  
    preTabActiveKey:'0'
  },
  effects: {
    /**
     * 获取实验室拟题、普通审批项目
     * payload{
     *  status:string,  //项目状态 0-待审批，1-带上报，(2，3，4)-获取历史操作项目
     *  data:{
     *    operationType:sting,  //操作类型
     *    operationUnit:string  //操作单位
     *  }
     * }
     *  
     */
    *fetchProjects({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(reqLabProjects, payload);
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
    },
    changePreTabActiveKey(state,{payload}){
      return {...state,preTabActiveKey:payload}
    }
  },
};
export default Model;
