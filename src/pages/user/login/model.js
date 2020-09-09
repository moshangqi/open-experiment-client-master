import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getFakeCaptcha,reqToken ,reqCaptchaP,reqUserInfo} from './service';
import { getPageQuery, setAuthority,setToken } from './utils/utils';
import router from 'umi/router';
import {message} from 'antd'

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    imgSrc: '',
    user:{}
  },
  effects: {
    *login({ payload }, { call, put }) {
     // const response = yield call(fakeAccountLogin, payload);
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // }); // Login successfully
      const res = yield call(reqToken,payload)
      if(res.code===0){
        setAuthority([res.data.roles.id]);
        setToken(res.data.token)
        yield put({
          type:'save',
          payload:res.data
        })
        message.success('登录成功')
      }else{
        message.error(`登录失败:${res.msg}`)
      }
      const res1 = yield call(reqUserInfo)
      if (res.code===0) {
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
        window.location.href = urlParams.origin
        //yield put(routerRedux.replace(redirect || '/'));

      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    //获取图片验证码
    *getCaptchaP({ payload },{ call,put }) {
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
    setImgSrc(state,{payload}){
      return { ...state, imgSrc:`data:image/jpg;base64,${payload.data}` }
    },
    save(state,{payload}){
      return {...state,user:payload}
    }
  },
};
export default Model;
