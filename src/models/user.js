import {
  queryCurrent,
  query as queryUsers,
  reqUserInfo,
  reqUpdateUserInfo,
  reqChangeUserRole,
  reqGetUserRoles,
  reqRealCollege,
} from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { message } from 'antd';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userInfo: {},
    userRoles: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(reqUserInfo);
      // console.log(response)
      if (response.code === 0) {
        // console.log('cur',response)
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        const code = response.data.code;
        const { data } = yield call(reqGetUserRoles, { userCode: code }); //查看用户权限
        yield put({
          type: 'saveInfo',
          payload: {
            userRoles: data,
          },
        });
        const res = yield call(reqRealCollege, { userId: code });
        console.log(res);
        if (res.code === 0) {
          yield put({
            type: 'saveCollege',
            payload: {
              college: res.data,
            },
          });
        }
        // console.log(data)
      } else if (response.code === 1401 || response.code === 1403) {
        yield put({
          type: 'login/logout',
        });
        message.warning(`您的登录已过期，请重新登录`);
      } else {
        message.error(`获取用户信息出错${response.msg}`);
      }
    },
    *updateUserInfo({ payload }, { call, put }) {
      const res = yield call(reqUpdateUserInfo, payload);
      if (res.code === 0) {
        message.success('修改成功');
      } else {
        message.error(`修改出错${res.msg}`);
      }
    },
    *changeUserRole({ payload }, { call, put }) {
      // const res = yield call(reqChanegRole, payload) //
      // const urlParams = new URL(window.location.href);
      // window.location.href = urlParams
      const { code, data } = yield call(reqChangeUserRole, payload);
      // console.log(res);
      if (code == 0) {
        console.log(code);
        localStorage.setItem('token', data.token);
        setAuthority([Number(payload.role)]);
        location.reload();
      }
      // location.reload()
      // console.log(payload);

      //刷新页面
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    saveInfo(state, action) {
      return { ...state, ...action.payload };
    },
    saveCollege(state, action) {
      console.log({ ...state, currentUser: { ...state.currentUser, ...action.payload.college } });
      return { ...state, currentUser: { ...state.currentUser, ...action.payload.college } };
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
