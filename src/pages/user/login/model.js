import { routerRedux } from 'dva/router';
import {
  fakeAccountLogin,
  getFakeCaptcha,
  reqToken,
  reqCaptchaP,
  reqUserInfo,
  reqLoginFirst,
  reqGetAllPermissions,
} from './service';
import { getPageQuery, setAuthority, setToken } from './utils/utils';
import router from 'umi/router';
import { message } from 'antd';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    imgSrc: '',
    user: {},
    visible: false,
    roleList: [],
    loading: false,
  },
  effects: {
    *changeUserRole({ payload }, { call, put }) {
      const res = yield call(reqChanegRole, payload); //
      console.log(res);

      //刷新页面
    },
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'modalChange',
        payload: {
          loading: true,
        },
      }); // Login successfully
      const res = yield call(reqToken, payload);
      if (res.code === 0) {
        setAuthority([res.data.roles.id]);
        setToken(res.data.token);
        yield put({
          type: 'save',
          payload: res.data,
        });
        message.success('登录成功');
      } else {
        message.error(`登录失败:${res.msg}`);
      }
      yield put({
        type: 'modalChange',
        payload: {
          loading: false,
          visible: false,
        },
      });
      const res1 = yield call(reqUserInfo);
      if (res.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // window.location.hash = '#/home'
        window.location.href = urlParams.origin + '/dist';
        // yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *loginFirst({ payload }, { call, put }) {
      yield put({
        type: 'modalChange',
        payload: {
          loading: true,
        },
      });
      const { code, data, msg } = yield call(reqLoginFirst, payload);
      console.log(code, data, msg);
      if (code == 0) {
        const response = yield call(reqGetAllPermissions, { userCode: payload.userCode });
        yield put({
          type: 'modalChange',
          payload: {
            roleList: response.data,
            visible: true,
            loading: false,
          },
        });
      } else {
        yield put({
          type: 'getCaptchaP',
        });
        message.error(msg);
      }
      yield put({
        type: 'modalChange',
        payload: {
          loading: false,
        },
      });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    //获取图片验证码
    *getCaptchaP({ payload }, { call, put }) {
      const res = yield call(reqCaptchaP);

      yield put({
        type: 'setImgSrc',
        payload: res,
      }); // Login successfully
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    setImgSrc(state, { payload }) {
      return { ...state, imgSrc: `data:image/jpg;base64,${payload.data}` };
    },
    save(state, { payload }) {
      return { ...state, user: payload };
    },
    modalChange(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
