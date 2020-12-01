import { queryCurrent, query as queryUsers,reqUserInfo,reqUpdateUserInfo } from '@/services/user';
import {message} from 'antd'
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userInfo:{}
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(reqUserInfo);
      if(response.code===0){
        // console.log('cur',response)
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }else if(response.code===1401||response.code===1403){
        yield put({
          type:'login/logout',
        })
        message.warning(`您的登录已过期，请重新登录`)

      }
      else{
        message.error(`获取用户信息出错${response.msg}`)
      } 
    },
    *updateUserInfo({payload},{call,put}){
      const res = yield call(reqUpdateUserInfo,payload)
      if(res.code===0){
        message.success('修改成功')
      }else{
        message.error( `修改出错${res.msg}`)
      }
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
    
      return { ...state, currentUser: action.payload || {} };
    },
    // changeNotifyCount(
    //   state = {
    //     currentUser: {},
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};
export default UserModel;
