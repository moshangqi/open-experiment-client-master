import { message } from 'antd';
import { certificateApply , myApplication ,deleteApplication} from './service';

const Model = {
  namespace: 'resCertific',
  state: {
    projects:[]
  },
  effects: {
    *applyCertificate({ payload }, { call }) {
      const res  = yield call(certificateApply, payload);
      console.log(res);
      if(res.code===0) {
        message.success('提交成功');
      }
      else{
        message.error('提交出错'+res.msg)
      }
      let sleep = function(time) {
        let startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
      };

      sleep(400)
      window.location.reload();
    },

    *viewMyApplication({ payload, callback }, { call, put }) {
      const response = yield call(myApplication, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },

    *deleteMyApplication({ payload }, { call ,put}) {
      const res  = yield call(deleteApplication, payload);
      console.log(res);
      if(res.code===0) {
        message.success('删除成功');
      }
        else{
        message.error('删除出错'+res.msg)
      }
      const response = yield call(myApplication, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });

    },


  },
  reducers: {
    save(state, action) {
      return { ...state, projects: action.payload };
    }
  },
};
export default Model;
