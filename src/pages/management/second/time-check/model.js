import { message } from 'antd';
import { reqTimeLimit,reqDeleteTimeLimit,reqSetTimeLimit,reqUpdateTimeLimit} from './service';

const Model = {
  namespace: 'secondSetting11',
  state: {
    timeLimits:[]
  },
  effects: {
    *fetch({ payload }, { call,put }) {
      const res = yield call(reqTimeLimit, payload);
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
    *add({payload},{call,put}){
      const res = yield call (reqSetTimeLimit,payload)
      if(res.code===0){
        message.success('添加成功')
        yield put({
          type:'fetch'
        })
      }else{
        message.error(`操作失败：${res.msg}`)
      }
    },
    *delete({payload},{call,put}){
      const res = yield call(reqDeleteTimeLimit,payload)
      if(res.code===0){
        yield put({
          type:'fetch'
        })
        message.success('操作成功')
      }else{
        message.error(`操作失败：${res.msg}`)
      }
    },
    *update({payload},{call,put}){
      const res = yield call(reqUpdateTimeLimit,payload)
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
     return {...state,timeLimits:payload}
   }
 } 
};
export default Model;
