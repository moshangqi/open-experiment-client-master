import { Form, Tabs, Button, Modal, Select } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';
import styles from './index.less';
import {connect} from 'dva';
import message from '@/pages/message';
import { setAuthority } from '../../utils/utils';


const role = {
  "1": "学生",
  "3": "指导教师",
  "4": "实验室主任",
  "5": "二级单位（学院领导）",
  "6": "职能部门",
  "7": "职能部门领导",
  "9": "学院结题评审老师",
  "10": "研究生",
  "11": "立项评审老师"
}

@connect(({ userLogin, loading }) => ({
  userLogin,
  imgSrc:userLogin.imgSrc,
  submitting: loading.effects['userLogin/login'],
  visible: userLogin.visible,
  roleList: userLogin.roleList,
  loading: userLogin.loading
}))
class Login extends Component {
  static Tab = LoginTab;

  static Submit = LoginSubmit;

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  state = {
    loading2: false
  }
  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  onSwitch = type => {
    this.setState(
      {
        type,
      },
      () => {
        const { onTabChange } = this.props;

        if (onTabChange) {
          onTabChange(type);
        }
      },
    );
  };

  getContext = () => {
    const { form } = this.props;
    const { tabs = [] } = this.state;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: { ...form },
      updateActive: activeItem => {
        const { type = '', active = {} } = this.state;

        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }

        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = e => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];

    if (form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          if (onSubmit) {
            onSubmit(err, values);
          }
        },
      );
    }
  };

  firstLogin = () => {
    const {form, checkLogin} = this.props;
    const { active = {}, type = '' } = this.state;
    const activeFields = active[type] || [];
    if(form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          checkLogin(values)
        },
      );
    }
  }

  secondLogin = () => {
    if(!this.state.role) {
      message.error('请选择登陆身份')
      return
    }
    const {form, checkLogin, onSubmit} = this.props;
    const { active = {}, type = '' } = this.state;
    const activeFields = active[type] || [];
    if(form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          onSubmit(err, {...values, role: this.state.role});
        },
      );
    }
  }

  cancle = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userLogin/modalChange',
      payload: {
        visible: false
      }
    })
  }


  render() {
    const { className, children, visible, roleList, loading } = this.props;
    const { type, tabs = [], loading2 } = this.state;
    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }

      if (child.type.typeName === 'LoginTab') {
        TabChildren.push(child);
      } else {
        otherChildren.push(child);
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit} >
            {tabs.length ? (
              <React.Fragment>
                <Tabs
                  animated={false}
                  className={styles.tabs}
                  activeKey={type}
                  onChange={this.onSwitch}
                >
                  {TabChildren}
                </Tabs>
                {otherChildren}
              </React.Fragment>
            ) : (
              children
            )}
            <Button type='primary' onClick={this.firstLogin} style={{width:'100%',marginTop:"24px"}} loading={loading}>登录</Button>
              <Modal 
              className = 'login-modal'
              visible={visible}
              title={'选择身份'}
              onCancel = {this.cancle}
              footer={[
                <Button loading={loading} type='primary' onClick={this.secondLogin} >登录</Button>,
              ]}
            >
              <Select placeholder='请选择登录身份' onChange={e=>{
                this.setState({role: e})
                setAuthority(e)
              }} style={{width:'100%'}}>
                {
                  roleList.map((item, index)=>{
                    return <Select.Option value={item} key={index}>{role[item]}</Select.Option>
                  })
                }
              </Select>
            </Modal>
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});
export default Form.create()(Login);
