import { reqXRemoveStudent,reqXApplyStudents,reqXSearchStudents,reqXAgreeStudent,reqXRejectStudent,reqXSetProjectLeader,reqXAddStudent, reqXFilterStudent } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'applyXStudents',
  state: {
    data:[],
    searchStudents:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(reqXApplyStudents, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *filter({payload},{call,put}){
      const res = yield call(reqXFilterStudent,payload)
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
      const res = yield call(reqXSearchStudents,payload)
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
      const res = yield call(reqXRejectStudent,payload)
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

      const res = yield call(reqXRemoveStudent,payload)
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
      const res = yield call(reqXAgreeStudent,payload)
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
      const res = yield call(reqXSetProjectLeader,payload)
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
      const res = yield call(reqXAddStudent,payload)
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
