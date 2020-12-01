import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { Component } from 'react';
import omit from 'omit.js';
import ItemMap from './map';
import LoginContext from './LoginContext';
import styles from './index.less';
import {connect} from 'dva';
const { Option } = Select;

const FormItem = Form.Item;

@connect(({ userLogin, loading }) => ({
  roleList: userLogin.roleList
}))
class WrapFormItem extends Component {
  static defaultProps = {
    getCaptchaButtonText: 'captcha',
    getCaptchaSecondText: 'second',
  };

  interval = undefined;

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    const { updateActive, name = '' } = this.props;

    if (updateActive) {
      updateActive(name);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;
    const result = onGetCaptcha ? onGetCaptcha() : null;

    if (result === false) {
      return;
    }

    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };

  getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }) => {
    const options = {
      rules: rules || customProps.rules,
    };

    if (onChange) {
      options.onChange = onChange;
    }

    if (defaultValue) {
      options.initialValue = defaultValue;
    }

    return options;
  };

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { count } = this.state; // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil


    const {
      onChange,
      customProps,
      defaultValue,
      rules,
      name,
      getCaptchaButtonText,
      getCaptchaSecondText,
      handleCaptchaPClick,
      updateActive,
      imgSrc,
      type,
      form,
      tabUtil,
      ...restProps
    } = this.props;

    if (!name) {
      return null;
    }

    if (!form) {
      return null;
    }

    const { getFieldDecorator } = form; // get getFieldDecorator props

    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    if (type === 'Captcha') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }
    if (type === 'CaptchaP') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={8}>
              <img onClick={handleCaptchaPClick} src={imgSrc} alt="" />
            </Col>
            <Col span={16}>
              {getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}
            </Col>
          </Row>
        </FormItem>
      );
    }

    if (type === 'Role') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          {getFieldDecorator(
            name,
            options,
          )(
            <Select placeholder="请选择角色类型">
              <Option value="1">学生</Option>
              {/* <Option value="2">学生（项目组长）</Option> */}
              <Option value="3">指导教师</Option>
              <Option value="4">实验室主任</Option>
              <Option value="5">二级单位（学院领导）</Option>
              <Option value="6">职能部门</Option>
              <Option value="7">职能部门领导</Option>
              <Option value="9">学院结题评审老师</Option>
              <Option value="11">立项评审老师</Option>
            </Select>,
          )}
        </FormItem>
      );
    }

    return (
      <FormItem>
        {getFieldDecorator(name, options)(<Input {...customProps} {...otherProps} />)}
      </FormItem>
    );
  }
}

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];

  LoginItem[key] = props => (
    <LoginContext.Consumer>
      {context => (
        <WrapFormItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});
export default LoginItem;
