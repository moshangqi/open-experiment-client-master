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
import moment from 'moment';
import {
  majorCollege,
  grade,
  suggestGroupType,
  experimentType,
  funds,
  major,
} from '@/utils/constant';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
let id = 0;

class BasicForm extends Component {
  state = {
    data: [],
    value: undefined,
    timeout: null,
    currentValue: undefined,
  };
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let limitCollege = values.limitCollege
          ? values.limitCollege.indexOf(null) >= 0
            ? null
            : JSON.stringify(values.limitCollege)
          : null;
        let limitMajor = values.limitMajor
          ? values.limitMajor.indexOf(null) >= 0
            ? null
            : JSON.stringify(values.limitMajor)
          : null;
        console.log(values);
        let payload = {
          ...values,
          limitCollege,
          limitGrade:
            values.limitGrade && values.limitGrade[0] ? JSON.stringify(values.limitGrade) : null,
          limitMajor,
          //startTime:values.time[0].format('YYYY-MM-DD'),
          //endTime:values.time[1].format('YYYY-MM-DD'),
          stuCodes: values.names ? values.names.filter(item => item) : [],
        };
        delete payload.names;
        delete payload.keys;
        delete payload.time;

        //payload.anotherTeacherCodes为''，删除payload.anotherTeacherCodes这一属性
        if (!payload.anotherTeacherCodes) {
          delete payload.anotherTeacherCodes;
        }

        if (form.getFieldValue('isOpenTopic') === '1') delete payload.stuCodes;

        dispatch({
          type: 'applyForm/submitRegularForm',
          payload,
          form,
        });
        //form.resetFields()
        console.log(payload);
      }
    });
  };
  onChange = value => {
    console.log(value);
    this.setState({ value });
  };
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  renderTreeNode = majorCollege => {
    let nodes = majorCollege.map(item => {
      return (
        <TreeNode value={item.cId + 'c'} title={item.cName} key={item.cId + 'c'} selectable={false}>
          {item.majors.map(element => {
            return (
              <TreeNode value={element.mId} key={element.mId} title={element.mName}></TreeNode>
            );
          })}
        </TreeNode>
      );
    });
    let notLimitNode = <TreeNode value={null} title="不限专业" key="all"></TreeNode>;
    nodes.unshift(notLimitNode);
    return nodes;
  };
  handleSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      this.fetchStudents(value);
    } else {
      dispatch({
        type: 'applyForm/saveStudents',
        payload: [],
      });
    }
  };

  fetchStudents = value => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.currentValue = value;
    const { dispatch } = this.props;
    this.timeout = setTimeout(() => {
      dispatch({
        type: 'applyForm/fetchStudents',
        payload: {
          keyWord: value,
          isTeacher: false,
        },
      });
    }, 300);
  };
  handleSelect = value => {
    const { form } = this.props;
    console.log(value);
    // form.setFieldValue('')
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
      students,
    } = this.props;
    const topFiftyStudents = students.slice(0, 50);
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
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const options = topFiftyStudents.map((s, index) => (
      <Option key={index} value={s.code}>
        <span>{s.realName}</span>
        <span style={{ margin: '0 30px' }}>{s.code}</span>
        <span>{(major.find(item => item.mId === s.major) || {}).mName}</span>
      </Option>
    ));
    const formItems = keys.map((k, index) => (
      <Form.Item label={index === 0 ? '学生关键字' : ''} required={false} key={index}>
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '请选择成员或者删除该项',
            },
          ],
        })(
          <Select
            showSearch
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            notFoundContent={null}
            onSelect={this.handleSelect}
            style={{
              width: '80%',
            }}
            placeholder="姓名或学号"
          >
            {options}
          </Select>,
        )}
        {keys.length > 1 ? (
          <Icon
            className={styles.dynamicDeleteButton}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    const Label = ({ children }) => (
      <span>
        <span style={{ color: 'red' }}>*</span>
        {children}
      </span>
    );
    return (
      <PageHeaderWrapper content="此表单为立项申请表，由指导老师填写">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label={<Label>项目名称</Label>}>
              {getFieldDecorator('projectName', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input placeholder="项目名称" />)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="起止日期">
              {getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
              })(
                <RangePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder={['开始日期', '结束日期']}
                />,
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} label={<Label>实验室名称</Label>}>
              {getFieldDecorator('labName', {
                rules: [
                  {
                    required: true,
                    message: '请输入实验室名称',
                  },
                ],
              })(<Input placeholder="请输入实验室名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>地点</Label>}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目地点',
                  },
                ],
              })(<Input placeholder="请输入项目地点" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>开放实验条件</Label>}>
              {getFieldDecorator('experimentCondition', {
                rules: [
                  {
                    required: true,
                    message: '请输入开放实验条件',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="请输入开放实验条件"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>实验类型</Label>}>
              <div>
                {getFieldDecorator(
                  'experimentType',
                  {},
                )(
                  <Radio.Group>
                    {Object.keys(experimentType).map(item => {
                      return (
                        <Radio key={item} value={item}>
                          {experimentType[item]}
                        </Radio>
                      );
                    })}
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>建议审分组</Label>}>
              <div>
                {getFieldDecorator(
                  'suggestGroupType',
                  {},
                )(
                  <Radio.Group>
                    {['1', '2', '3', '6', '4', '5'].map(item => {
                      return (
                        <Radio value={item} key={item}>
                          {suggestGroupType[item]}
                        </Radio>
                      );
                    })}
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>项目级别</Label>}>
              <div>
                {getFieldDecorator('projectType', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">普通</Radio>
                    <Radio value="2">重点</Radio>
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="限选专业">
              {getFieldDecorator(
                'limitMajor',
                {},
              )(
                <TreeSelect
                  placeholder="请选择适应专业 (选填)"
                  allowClear
                  multiple={true}
                  onChange={this.onChange}
                >
                  {this.renderTreeNode(majorCollege)}
                </TreeSelect>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="限选年级">
              {getFieldDecorator(
                'limitGrade',
                {},
              )(
                <Select mode="multiple" placeholder="请选择限选年级 (选填)">
                  {[
                    <Option key="all" value={null}>
                      不限年级
                    </Option>,
                    ...grade.map(item => {
                      return (
                        <Option key={item} value={item}>
                          {item}级
                        </Option>
                      );
                    }),
                  ]}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="限选学院">
              {getFieldDecorator(
                'limitCollege',
                {},
              )(
                <Select mode="multiple" placeholder="请选择适应学院 (选填)">
                  {[
                    <Option key="all" value={null}>
                      不限学院
                    </Option>,
                    ...majorCollege.map(item => {
                      return (
                        <Option value={item.cId} key={item.cId}>
                          {item.cName}
                        </Option>
                      );
                    }),
                  ]}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>限选人数</Label>}>
              {getFieldDecorator('fitPeopleNum', {
                rules: [
                  {
                    required: true,
                    message: '请输入适宜学生数',
                  },
                  {
                    pattern: /[3-6]/,
                    message: '限选人数3~6人',
                  },
                ],
              })(<Input placeholder="请输入适宜学生数" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<Label>预申请金额</Label>}>
              {getFieldDecorator('applyFunds', {
                rules: [
                  {
                    required: true,
                    message: '请选择预申请金额',
                  },
                ],
              })(
                <Select placeholder="请选择预申请金额">
                  {funds.map(item => {
                    return (
                      <Option key={item} value={item}>
                        {item}元
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>计划实验时间/h</Label>}>
              {getFieldDecorator('totalHours', {
                rules: [
                  {
                    required: true,
                    message: '请输入计划实验时间',
                  },
                  {
                    pattern: /\d+/,
                    message: '请输入数字',
                  },
                ],
              })(<Input placeholder="请输入计划实验时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>成果及考核方式</Label>}>
              {getFieldDecorator('achievementCheck', {
                rules: [
                  {
                    required: true,
                    message: '请输入成果形式及考核方式',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="请输入成果形式及考核方式"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>主要内容</Label>}>
              {getFieldDecorator('mainContent', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目主要内容',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="请输入项目主要内容"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'第二指导老师'}>
              {getFieldDecorator('anotherTeacherCodes', {
                rules: [
                  {
                    pattern: /^\d\d\d\d\d\d\d\d\d\d\d\d$/,
                    message: '请输入12位工号',
                  },
                ],
              })(<Input placeholder="输入教师工号 (选填)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<Label>是否开放选题</Label>}>
              <div>
                {getFieldDecorator('isOpenTopic', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">公开</Radio>
                    <Radio value="2">不公开</Radio>
                    <Radio value="3">部分公开</Radio>
                  </Radio.Group>,
                )}

                <FormItem
                  style={{
                    margin: '8px 0',
                    display:
                      getFieldValue('isOpenTopic') === '3' || getFieldValue('isOpenTopic') === '2'
                        ? 'block'
                        : 'none',
                  }}
                >
                  {formItems}
                  <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                    <Icon type="plus" /> 添加成员
                  </Button>
                </FormItem>
              </div>
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              {/* <Button
                onClick={this.handleSubmit}
                style={{
                  marginLeft: 8,
                }}
              >
                保存
              </Button> */}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading, applyForm }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
    students: applyForm.students,
  }))(BasicForm),
);
