import { message } from 'antd';
import { reqAddRole,reqRemoveRole,reqRoleList } from './service';

const Model = {
  namespace: 'role',
  state: {
    roles:[]
  },
  effects: {
    *fetch({ payload }, { call,put }) {
      const res = yield call(reqRoleList, payload);
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
      const res = yield call (reqAddRole,payload)
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
      const res = yield call(reqRemoveRole,payload)
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
     return {...state,roles:payload}
   }
 } 
};
export default Model;
