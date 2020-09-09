import { message } from 'antd';
import { reqLimitList,reqAppendLimits,reqUpdateLimits } from './service';

const Model = {
  namespace: 'setting',
  state: {
    colleges:[]
  },
  effects: {
    *fetch({ payload }, { call,put }) {
      const res = yield call(reqLimitList, payload);
      if(res.code===0)
        yield put({
          type:'save',
          payload:res.data
        })
      else{
        message.error(`请求出错${res.msg}`)
      }
      //window.location.href
    },
    *append({payload},{call,put}){
      console.log('appendlimit',payload)
      const res = yield call (reqAppendLimits,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'fetch'
        })
      }else{
        message.error(`操作失败：${res.msg}`)
      }
    },
    *update({payload},{call,put}){
      console.log('updatelimit',payload)
      const res = yield call(reqUpdateLimits,payload)
      if(res.code===0){
        yield put({
          type:'fetch'
        })
        message.success('操作成功')
      }else{
        message.error(`操作失败：${res.msg}`)
      }
    }
  },
  
 reducers:{
   save(state,{payload}){
     return {...state,colleges:payload}
   }
 } 
};
export default Model;
