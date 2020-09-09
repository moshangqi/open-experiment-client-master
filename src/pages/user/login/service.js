import request from '@/utils/request';
//将对象转为queryString方法,POST时使用
let objToQs = (obj)=>{
  return Object.keys(obj).reduce((before,value,index,keys)=>{
      if(keys.length===index+1)
      return `${before}${value}=${obj[value]}`
      else
      return `${before}${value}=${obj[value]}&`
  },'')
}
export async function reqUserInfo(){
  return request('/user/getMyInfo')
}
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function reqToken(params){
  return request('/anon/login', {
    method: 'POST',
    data: {userCode:params.userName,password:params.password,verifyCode:params.captchaP,role:params.role},
  });
}
export async function reqCaptchaP(){
  return request('/anon/sendVerifyCode',{
    method:'GET'
  })
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
