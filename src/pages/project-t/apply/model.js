import { message } from 'antd';
import { reqApplyForm,reqSearchStudents } from './service';

const Model = {
  namespace: 'applyForm',
  state: {
    students:[]
  },
  effects: {
    *submitRegularForm({ payload,form }, { call }) {

      const res = yield call(reqApplyForm, payload);
      if(res.code===0){
        message.success('提交成功');
        form.resetFields();
      }else{
        message.error(`提交失败：${res.msg}`)
      }
      
      //window.location.href
    },
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

    }
  },
  reducers:{
    saveStudents(state,{payload}){
    return {...state,students:payload}

    }
  }
};
export default Model;
