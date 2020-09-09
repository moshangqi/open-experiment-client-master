import { message } from 'antd';
import { reqUpdateApply } from './service';

const Model = {
  namespace: 'userBaseInfo',
  state: {},
  effects: {
    *submitUpdateForm({ payload }, { call }) {
      yield call(reqUpdateApply, payload);
      if(res.code===0)
      message.success('提交成功');
      else{
        message.error('编辑出错')
      }
      //window.location.href
    },
  },
};
export default Model;
