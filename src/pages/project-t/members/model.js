import { reqRemoveStudent,reqApplyStudents,reqSearchStudents,reqAgreeStudent,reqRejectStudent,reqSetProjectLeader,reqAddStudent, reqFilterStudent } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'applyStudents',
  state: {
    data:[],
    searchStudents:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqApplyStudents, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *filter({payload},{call,put}){
      const res = yield call(reqFilterStudent,payload)
      if(res.code===0){
        yield put({
          type: 'save',
          payload: res.data,
        });
      }else{
        message.error('筛选失败')
      }
    }
    ,
    *fetchStudents({payload},{call,put}){
      const res = yield call(reqSearchStudents,payload)
      if(res.code===0){
        yield put({
          type:'saveStudents',
          payload:res.data
        })
      }else{
        message.error(`请求失败：${res.msg}`)
      }

    },
    *reject({payload,filterData},{call,put}){
      const res = yield call(reqRejectStudent,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'filter',
          payload:filterData
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    },
    *remove({payload,filterData},{call,put}){
      
      const res = yield call(reqRemoveStudent,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'filter',
          payload:filterData
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    }
    ,
    *agree({payload,filterData},{call,put}){
      const res = yield call(reqAgreeStudent,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'filter',
          payload:filterData
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    },
    *setLeader({payload,filterData},{call,put}){
      const res = yield call(reqSetProjectLeader,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'filter',
          payload:filterData
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    },
    *add({payload,filterData},{call,put}){
      const res = yield call(reqAddStudent,payload)
      if(res.code===0){
        message.success('操作成功')
        yield put({
          type:'filter',
          payload:filterData
        })
      }else{
        message.error(`操作失败:${res.msg}`)
      }
    },

  },
  reducers: {
    save(state, action) {
      let data = action.payload.map(item=>{
        let data = {
          ...item,...item.userDetailVO,id:item.id
        }
        delete data.userDetailVO
        return data
      })
      return { ...state, data };
    },
    saveStudents(state,{payload}){
      return {...state,searchStudents:payload}
  
    }
  },
};
export default Model;
