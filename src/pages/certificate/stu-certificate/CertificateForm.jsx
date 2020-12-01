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
import { connect } from 'dva';
import moment from 'moment'
import {majorCollege } from '@/utils/constant'
import { router } from 'umi';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
let id = 0;


class   CertificateForm extends Component {
  state={}
  handleSubmit = e => {
    const { dispatch, form ,detail} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const payload = {
          ...values
        }
        dispatch({
          type: 'resCertific/applyCertificate',
          payload,
        });
        dispatch({
          type: 'resCertific/viewMyApplication'
        });
      }
    });
  };
  onChange = value => {
    this.setState({ value });
  };



  render() {
    const { submitting} = this.props;
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

    const Label = ({children})=><span><span style={{color:'red'}}>*</span>{children}</span>
    return (
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label={<Label>立项编号</Label>}>
              {getFieldDecorator('serialNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入编号',
                  },
                ]
              })(<Input placeholder="编号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>项目名称</Label>}>
              {getFieldDecorator('projectName', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ]
              })(<Input placeholder="项目名称" />)}
            </FormItem>


            <FormItem {...formItemLayout} label={<Label>姓名</Label>}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder="姓名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>学号</Label>}>
              {getFieldDecorator('userId', {
                rules: [
                  {
                    required: true,
                    message: '请输入学号',
                  },
                ],
              })(<Input placeholder="学号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>项目类型</Label>}>
              {getFieldDecorator('projectType', {
                rules: [
                  {
                    required: true,
                    message: '请选择项目类型',
                  },
                ],
              })(<Select>
                <Select.Option value="1">普通</Select.Option>
                <Select.Option value="2">重点</Select.Option>
              </Select>)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>成员身份</Label>}>
              {getFieldDecorator('memberRole', {
                rules: [
                  {
                    required: true,
                    message: '请选择成员身份',
                  },
                ],
              })(<Select>
                <Select.Option value="2">项目组长</Select.Option>
                <Select.Option value="3">普通成员</Select.Option>
              </Select>)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>项目所属学院</Label>}>
              {getFieldDecorator('subordinateCollage', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属学院',
                  },
                ],
              })(<Select>
                <Select.Option value="石油与天然气工程学院">石油与天然气工程学院</Select.Option>
                <Select.Option value="地球科学与技术学院">地球科学与技术学院</Select.Option>
                <Select.Option value="机电工程学院">机电工程学院</Select.Option>
                <Select.Option value="化学化工学院">化学化工学院</Select.Option>
                <Select.Option value="材料科学与工程学院">材料科学与工程学院</Select.Option>
                <Select.Option value="计算机科学学院">计算机科学学院</Select.Option>
                <Select.Option value="电气信息学院">电气信息学院</Select.Option>
                <Select.Option value="土木工程与建筑学院">土木工程与建筑学院</Select.Option>
                <Select.Option value="理学院">理学院</Select.Option>
                <Select.Option value="经济管理学院">经济管理学院</Select.Option>
                <Select.Option value="法学院">法学院</Select.Option>
                <Select.Option value="外国语学院">外国语学院</Select.Option>
                <Select.Option value="体育学院">体育学院</Select.Option>
                <Select.Option value="艺术学院">艺术学院</Select.Option>
                <Select.Option value="马克思主义学院">马克思主义学院</Select.Option>
              </Select>)}
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
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['newCertificate/applyCertificate'],
  }))(CertificateForm),
);
