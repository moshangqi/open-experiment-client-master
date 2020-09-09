import { getAllMes,confirmMes} from './service';
import { message } from 'antd';

const Model = {
  namespace: 'getMessage',
  state: {
    messages:[],
  },
  effects: {
    *getAllMyMessage({ payload }, { call, put }) {
      const response = yield call(getAllMes, payload);
      console.log(response.data);
      if(response.code===0){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }else{
        message.error('获取所有消息出错'+response.msg)
      }

    },

    *confirmReceiptOfMidtermReminder({ payload }, { call, put }) {
      const response = yield call(confirmMes, payload);
      console.log(response.data);
      if(response.code===0){
        message.success("确认消息成功")
      }else{
        message.error('确认消息出错'+response.msg)
      }
      const res = yield call(getAllMes, payload);
      console.log(res.data);
      if(res.code===0){
        yield put({
          type: 'save',
          payload: res.data,
        });
      }else{
        message.error('获取消息出错'+res.msg)
      }

    },



  },
  reducers: {
    save(state, {payload}) {
      return { ...state, messages: payload };
    }
  },
};
export default Model;
