import {Alert, Checkbox, Form, Icon, Select} from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit,CaptchaP, Role } = LoginComponents;
const { Option } = Select;
const FormItem = Form.Item;
@connect(({ userLogin, loading }) => ({
  userLogin,
  imgSrc:userLogin.imgSrc,
  submitting: loading.effects['userLogin/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };
  componentDidMount(){
    this.handleCaptchaPClick()
  }
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;

      dispatch({
        type: 'userLogin/login',
        payload: { ...values, type },
      });
      console.log(...values);
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'userLogin/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });
  handleCaptchaPClick = ()=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/getCaptchaP'
      })
  }
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  sendUser= () =>{
    console.log(this);
  }
;
  render() {
    const { userLogin, submitting,imgSrc } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName
              name="userName"
              placeholder={`${'用户名'}`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
              onChange={this.sendUser()}
            />
            <Password
              name="password"
              placeholder={`${'密码'}`}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            <CaptchaP
              name="captchaP"
              placeholder="验证码"
              onGetCaptcha={this.onGetCaptcha}
              handleCaptchaPClick={this.handleCaptchaPClick}
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              imgSrc={imgSrc}
            ></CaptchaP>

            <Role
              name="role"
              placeholder={`${'用户类型'}`}
              rules={[
                {
                  required: true,
                  message: '请选择用户类型!',
                },
              ]}
            />

            {/*<Select*/}
            {/*  placeholder="请选择登录角色"*/}
            {/*>*/}
            {/*  <Option value="male">male</Option>*/}
            {/*  <Option value="female">female</Option>*/}
            {/*  <Option value="other">other</Option>*/}
            {/*</Select>*/}


          </Tab>

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
            其他登录方式
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div> */}
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
