import { message } from 'antd';
import { reqInnerApplyForm } from './service';

const Model = {
  namespace: 'innerApply',
  state: {
    students:[]
  },
  effects: {
    *FunctionCreateCommonApply({ payload,form }, { call }) {

      const res = yield call(reqInnerApplyForm, payload);
      if(res.code===0){
        message.success('提交成功');
        form.resetFields();
      }else{
        message.error(`提交失败：${res.msg}`)
      }

      //window.location.href
    },
  },

};
export default Model;
