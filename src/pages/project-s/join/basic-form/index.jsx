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
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import BaseInfo from './cpmponents/BaseInfo';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { projectType, suggestGroupType, major, experimentType } from '@/utils/constant';
import moment from 'moment';
import { isEmpty } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
let id = 0;

class BasicForm extends Component {
  state = {};

  componentWillMount() {
    if (!isEmpty(this.props.detail)) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/fetchDetail',
      payload: JSON.parse(localStorage.getItem('payload-d')),
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'formBasicForm/submitRegularForm',
          payload: values,
        });
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
  handleApply = () => {
    const { dispatch, detail, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.projectGroupId = detail.id;
        dispatch({
          type: 'studentProjects/join',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting, detail } = this.props;
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
    // const formItems = keys.map((k, index) => (
    //   <Form.Item
    //     {...formItemLayout}
    //     label={index === 0 ? `学期${index+1}` : `学期${index+1}`}
    //     required={false}
    //     key={k}
    //   >
    //     {getFieldDecorator(`names[${k}]`, {
    //       validateTrigger: ['onChange', 'onBlur'],
    //       rules: [
    //         {
    //           required: true,
    //           whitespace: true,
    //           message: "请输入成绩或者删除该项",
    //         },
    //       ],
    //     })(<Input placeholder="学分绩点" style={{width:'80%',marginRight:8}} />)}
    //     {keys.length > 1 ? (
    //       <Icon
    //         className={styles.dynamicDeleteButton}
    //         type="minus-circle-o"
    //         onClick={() => this.remove(k)}
    //       />
    //     ) : null}
    //   </Form.Item>

    // ));
    const content = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="项目名称">{detail.projectName}</Descriptions.Item>
            <Descriptions.Item label="指导老师">
              {detail.list.find(item => item.code === detail.creatorId).realName}
            </Descriptions.Item>
            <Descriptions.Item label="开放实验室">{detail.labName}</Descriptions.Item>
            <Descriptions.Item label="地点">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="实验类型">
              {experimentType[detail.experimentType]}
            </Descriptions.Item>
            <Descriptions.Item label="实验时间">
              {moment(detail.startTime).format('YYYY-MM-DD') +
                '~' +
                moment(detail.endTime).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="项目级别">
              {detail.projectType === 1 ? '重点' : '普通'}
            </Descriptions.Item>
            <Descriptions.Item label="建议评审分组">
              {suggestGroupType[detail.suggestGroupType]}
            </Descriptions.Item>
            {/* <Descriptions.Item label="适应专业">{JSON.parse(detail.limitMajor).map(item=>major[item-1].mName).join('、')}</Descriptions.Item> */}
            <Descriptions.Item label="限定人数">{detail.fitPeopleNum}</Descriptions.Item>
            <Descriptions.Item label="成果及考核方式">{detail.achievementCheck}</Descriptions.Item>
            <Descriptions.Item label="计划实验小时">{detail.totalHours}</Descriptions.Item>
            <Descriptions.Item label="开放实验条件">{detail.experimentCondition}</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const Label = ({ children }) => (
      <span>
        <span style={{ color: 'red' }}>*</span>
        {children}
      </span>
    );
    return (
      <PageHeaderWrapper
        content={<BaseInfo detail={detail} />}
        extra={
          <Button
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            返回
          </Button>
        }
      >
        <Card
          bordered={false}
          title="项目主要内容"
          style={{
            marginBottom: 25,
          }}
        >
          {detail.mainContent}
        </Card>
        <Card
          bordered={false}
          title={
            <span>
              申请表{' '}
              <span style={{ fontSize: 14, color: '#aaa', marginLeft: 10 }}>
                (申请前请先完善个人信息)
              </span>
            </span>
          }
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            {/* <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('projectName', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input placeholder="项目名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              <div>
                {getFieldDecorator('experimentType', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                    
                  </Radio.Group>,
                )}
                
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="学号">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入学号',
                  },
                ],
              })(<Input placeholder="请输入学号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="专业">
              {getFieldDecorator('labName', {
                rules: [
                  {
                    required: true,
                    message: '请输入所在专业',
                  },
                ],
              })(<Input placeholder="请输入所在专业" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="年级">
              {getFieldDecorator('labName', {
                rules: [
                  {
                    required: true,
                    message: '请输入所在年级',
                  },
                ],
              })(<Input placeholder="请输入所在年级" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="QQ号">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入QQ号',
                  },
                ],
              })(<Input placeholder="请输入QQ号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话',
                  },
                ],
              })(<Input placeholder="请输入联系电话" />)}
            </FormItem> */}

            <FormItem {...formItemLayout} label={<Label>个人特长</Label>}>
              {getFieldDecorator('personalJudge', {
                rules: [
                  {
                    required: true,
                    message: '请输入个人特长',
                  },
                  {
                    min: 10,
                    message: '字数不能少于10',
                  },
                  {
                    max: 199,
                    message: '字数不能超过200',
                  },
                ],
              })(<TextArea placeholder="请输入个人特长" rows={6} />)}
            </FormItem>

            {/* <FormItem {...formItemLayout} label={<Label>已修课程及具备知识</Label>}>
              {getFieldDecorator('technicalRole', {
                rules: [
                  {
                    required: true,
                    message: '请输入已修课程及具备知识',
                  },
                  {
                    min:10,
                    message:"字数不能少于10"
                  },
                  {
                    max:199,
                    message:"字数不能超过200"
                  },
                ],
              })(
                <TextArea
                
                  placeholder="请输入已修课程及具备知识"
                  rows={6}
                />,
              )}
            </FormItem> */}
            {/* <FormItem {...formItemLayout} label="建议评审分组">
              <div>
                {getFieldDecorator('suggestGroupType', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">A组-石工地勘</Radio>
                    <Radio value="2">B组-化工材料</Radio>
                    <Radio value="3">C组-机械力学</Radio>
                    <Radio value="4">D组-电气及制作</Radio>
                    <Radio value="5">E组-软件与数学</Radio>
                    <Radio value="5">F组-经管法艺体人文</Radio>
                  </Radio.Group>,
                )}
                
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="项目级别">
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
            <FormItem {...formItemLayout} label="适应专业">
              {getFieldDecorator('limitMajor', {
                rules: [
                  {
                    required: true,
                    message: '请输入适应专业',
                  },
                ],
              })(<TreeSelect              
                value={this.state.value}               
                placeholder="请选择适应专业"
                allowClear
                multiple={true}
                onChange={this.onChange}
              >             
                <TreeNode value="0" title="计科院" key="0-1-1" selectable={false}>
                  <TreeNode value="0-1" title="软件工程" key="random"/>
                  <TreeNode value="0-2" title="网络工程" key="random1" />
                  <TreeNode value="0-3" title="物联网工程" key="random2" />
                  <TreeNode value="0-4" title="计算机科学与技术" key="random4" />
                </TreeNode>
                <TreeNode value="1" title="石工院" key="0-1-2" selectable={false}>
                  <TreeNode value="1-1" title="石油工程" key="random5" />
                  <TreeNode value="1-2" title="石油与天然气工程" key="random6" />
                  <TreeNode value="1-3" title="油气储运工程" key="random7" />
                </TreeNode>
              </TreeSelect>)}
            </FormItem>
            <FormItem {...formItemLayout} label="适应年级">
              {getFieldDecorator('limitGrade', {
                rules: [
                  {
                    required: true,
                    message: '请输入适应年级',
                  },
                ],
                initialValue:['0','1']
              })(<Select
                mode="multiple"
                placeholder="请选择适应学院"
              >
                <Option value='0'>2016级</Option>
                <Option value='1'>2017级</Option> 
                <Option value='2'>2018级</Option>
                <Option value='3'>2019级</Option>
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="适应学院">
              {getFieldDecorator('limitCollege', {
                rules: [
                  {
                    required: true,
                    message: '请输入适应学院',
                  },
                ],
                initialValue:['0','1']
              })(<Select
                mode="multiple"
                placeholder="请选择适应学院"
              >
                <Option value='0'>计科院</Option>
                <Option value='1'>电信院</Option> 
                <Option value='2'>石工院</Option>
                <Option value='3'>化工院</Option>
                <Option value='4'>材料院</Option>
                <Option value='5'>电气院</Option>
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="适宜学生数">
              {getFieldDecorator('fitPeopleNum', {
                rules: [
                  {
                    required: true,
                    message: '请输入适宜学生数',
                  },
                ],
              })(<Input placeholder="请输入适宜学生数" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="预申请金额">
              {getFieldDecorator('xx', {
                rules: [
                  {
                    required: true,
                    message: '请选择预申请金额',
                  },
                ],
              })(<Select
                placeholder="请选择预申请金额"
              >
                <Option value='0'>500元</Option>
                <Option value='1'>2500元</Option> 
                <Option value='2'>3000元</Option>
                <Option value='3'>5000元</Option>
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="计划实验时间/h">
              {getFieldDecorator('totalHours', {
                rules: [
                  {
                    required: true,
                    message: '请输入计划实验时间',
                  },
                ],
              })(<Input placeholder="请输入计划实验时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="成果形式及考核方式">
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
            </FormItem> */}
            {/* <FormItem
              {...formItemLayout}
              label={
                <span>
                  客户
                  <em className={styles.optional}>
                    （选填）
                    <Tooltip title="目标的服务对象">
                      <Icon
                        type="info-circle-o"
                        style={{
                          marginRight: 4,
                        }}
                      />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  邀评人
                  <em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <Input placeholder="请直接 @姓名／工号，最多可邀请 5 人" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  权重
                  <em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('weight')(<InputNumber placeholder="请输入" min={0} max={100} />)}
              <span className="ant-form-text">%</span>
            </FormItem> */}

            {/* <FormItem
            {...formItemLayout}
            label="已修课程成绩"
            >
              {formItems}
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加
              </Button>
            </FormItem> */}
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" onClick={this.handleApply} loading={submitting}>
                提交
              </Button>
              {/* <Button
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
  connect(({ loading, detail }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
    detail: detail.baseInfo,
  }))(BasicForm),
);
