import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  TreeSelect,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment'
import {majorCollege } from '@/utils/constant'
import styles from './style.less';
import { router } from 'umi';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
let id = 0;

class BasicForm extends Component {
  state={}
  handleSubmit = e => {
    const { dispatch, form ,detail} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values
        }
         dispatch({
          type: 'user/updateUserInfo',
          payload,
        });
      }
    });
  };
  onChange = value => {
    this.setState({ value });
  };



  render() {
    const { submitting,currentUser } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const extra = <Button onClick={()=>{router.goBack()}}>返回</Button>
    const Label = ({children})=><span><span style={{color:'red'}}>*</span>{children}</span>
    return (
      <PageHeaderWrapper content="完善基本信息" extra={extra}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label={<Label>学号</Label>}>
              {getFieldDecorator('userId', {
                rules: [
                  {
                    required: true,
                    message: '请输入学号',
                  },

                ]
                ,initialValue:currentUser.code

              })(<Input placeholder="学号" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>姓名</Label>}>
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
                initialValue:currentUser.realName
              })(<Input placeholder="姓名" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>性别</Label>}>
              {getFieldDecorator('sex', {
                rules: [
                  {
                    required: true,
                    message: '选择性别',
                  },
                ],
                initialValue:currentUser.sex

              })(<Radio.Group>
                <Radio value='男'>
                  男
                </Radio>
                <Radio value='女'>
                  女
                </Radio>
              </Radio.Group>)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="身份证号">
              {getFieldDecorator('idCard', {
                rules: [
                  {
                    required: true,
                    message: '身份证号码不能为空',
                  },
                  {
                    pattern:/^\d*$/,
                    message:'请输入正确的身份证号码'
                  }
                ],
                initialValue:currentUser.mobilePhone

              })(
                <Input placeholder='请输入身份证号码'/>
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label="email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type:'email',
                    message:'请输入正确格式的邮箱'
                  }
                ],
                initialValue:currentUser.email

              })(<Input placeholder="email (选填)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>手机号码</Label>}>
              {getFieldDecorator('mobilePhone', {
                rules: [
                  {
                    required: true,
                    message: '手机号码不能为空',
                  },
                  {
                    pattern:/^\d*$/,
                    message:'请输入正确的手机号码'
                  }
                ],
                initialValue:currentUser.mobilePhone

              })(
                <Input placeholder='请输入手机号码'/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="固定电话">
              {getFieldDecorator('fixPhone', {
                rules: [
                  {
                    pattern:/^\d*$/,
                    message:'请输入正确的号码'
                  }
                ],
                initialValue:currentUser.fixPhone

              })(
                <Input placeholder='请输入固定电话 (选填)'/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>qq号</Label>}>
              {getFieldDecorator('qqNum', {
                rules: [
                  {
                    pattern:/^\d*$/,
                    message:'请输入正确的qq号码'
                  },
                  {
                    required: true,
                    message: '手机号码不能为空',
                  },
                ],
                initialValue:currentUser.qqNum

              })(
                <Input placeholder='请输入qq号码'/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>新密码</Label>}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required:true,
                    message:'请输入新密码'
                  }
                ],

              })(
                <Input placeholder='请输入新密码'/>
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >

              <Button
                onClick={this.handleSubmit}

                loading={submitting}
                type='primary'
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading,user }) => ({
    submitting: loading.effects['user/updateUserInfo'],
    currentUser:user.currentUser
  }))(BasicForm),
);
