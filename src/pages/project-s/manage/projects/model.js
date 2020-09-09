import { reqJoin,reqProjects} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'studentProjects',
  state: {
    projects:[],
    tabActiveKey:'2'
  },
  effects: {
    *fetchProjects({ payload }, { call, put }) {
      const response = yield call(reqProjects, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *join({payload},{call,put}){
      const res = yield call(reqJoin,payload)
      if(res.code===0){
        message.success('申请成功')
      }else{
        message.error(`申请失败:${res.msg}`)
      }
    }
    ,

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, projects: action.payload };
    }
    ,
    changeTabActiveKey(state,{payload}){
      return {...state,tabActiveKey:payload}
    }
  },
};
export default Model;
