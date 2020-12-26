import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Table, Button, Modal, Input, Select, Form, Popconfirm, DatePicker } from 'antd';
import { roleNames, majorCollege } from '@/utils/constant';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(({ setting, loading }) => ({
  colleges: setting.colleges,
  loading: loading.models.setting,
}))
class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mVisible: false,
      limit: { list: [] },
      isUpdate: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/fetch',
    });
  }
  columns = [
    {
      title: '学院',
      dataIndex: 'college',
      render: college => {
        return majorCollege.find(item => item.cId == college).cName;
      },
    },
    {
      title: '普通项目数',
      dataIndex: 'list',
      render: list => {
        const limit = list.find(item => item.projectType === 1);
        return limit ? limit.maxAmount : 0;
      },
    },
    {
      title: '重点项目数',
      render: college => {
        const limit = college.list.find(item => item.projectType === 2);
        return limit ? limit.maxAmount : 0;
      },
    },

    {
      title: '申报时间',
      render: limit => (
        <span>
          {moment(limit.startTime).format('YYYY-MM-DD HH:mm:ss') +
            '~' +
            moment(limit.endTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      render: limit => {
        return <a onClick={() => this.showSettingModal(limit)}>修改</a>;
      },
    },
  ];

  handleModalOk = () => {
    const { form, dispatch } = this.props;
    const { isUpdate, limit } = this.state;
    form.validateFields((err, values) => {
      if (isUpdate) {
        console.log(values);
        const startTime = values.time[0].format('x');
        const endTime = values.time[1].format('x');
        const normalLimit = limit.list.find(item => item.projectType === 1);
        const keyLimit = limit.list.find(item => item.projectType === 2);
        const list = [
          {
            id: normalLimit ? normalLimit.id : null,
            projectType: 1,
            maxAmount: values.normalCount,
          },
          {
            id: keyLimit ? keyLimit.id : null,
            projectType: 2,
            maxAmount: values.keyCount,
          },
        ];
        const payload = {
          college: limit.college,
          endTime,
          startTime,
          list,
        };

        dispatch({
          type: 'setting/update',
          payload,
        });
      } else {
        console.log(values);
        const startTime = values.time[0].format('x');
        const endTime = values.time[1].format('x');
        const list = [
          {
            projectType: 1,
            maxAmount: values.normalCount,
          },
          {
            projectType: 2,
            maxAmount: values.keyCount,
          },
        ];
        const payload = values.college.map(item => {
          return {
            limitCollege: item,
            endTime,
            startTime,
            list,
          };
        });
        dispatch({
          type: 'setting/append',
          payload,
        });
      }
    });
    this.setState({
      mVisible: false,
    });
  };
  showSettingModal = limit => {
    this.setState({
      mVisible: true,
      isUpdate: !!limit,
      limit,
    });
  };
  hideModal = () => {
    const { form } = this.props;
    this.setState({
      mVisible: false,
    });
    form.resetFields();
  };
  render() {
    const title = (
      <Button type="primary" onClick={() => this.showSettingModal(false)}>
        批量设置
      </Button>
    );
    const { getFieldDecorator } = this.props.form;
    const { mVisible, isUpdate, limit } = this.state;
    const normalCount = limit.list && limit.list.find(item => item.projectType === 1);
    const keyCount = limit.list && limit.list.find(item => item.projectType === 2);
    const { colleges, loading } = this.props;
    const formLayout = {
      wrapperCol: {
        span: 18,
      },
      labelCol: {
        span: 5,
      },
    };
    return (
      <PageHeaderWrapper>
        <Card title={title}>
          <Modal
            onOk={this.handleModalOk}
            onCancel={this.hideModal}
            title="立项限制"
            visible={mVisible}
            width="600px"
          >
            <Form {...formLayout}>
              {!isUpdate ? (
                <Form.Item label="学院">
                  {getFieldDecorator(
                    'college',
                    {},
                  )(
                    <Select allowClear mode="multiple" placeholder="请选择学院">
                      {majorCollege.map(item => {
                        return (
                          <Option value={item.cId} key={item.cId}>
                            {item.cName}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item label="普通项目数">
                {getFieldDecorator('normalCount', {
                  initialValue: isUpdate ? (normalCount ? normalCount.maxAmount : undefined) : '',
                })(<Input placeholder="请输入项目数量"></Input>)}
              </Form.Item>
              <Form.Item label="重点项目数">
                {getFieldDecorator('keyCount', {
                  initialValue: isUpdate ? (keyCount ? keyCount.maxAmount : undefined) : '',
                })(<Input placeholder="请输入项目数量"></Input>)}
              </Form.Item>
              {/* <Form.Item label='特殊重点项目数'>
              {getFieldDecorator('proKeyCount')(
                <Input placeholder='请输入项目数量'></Input>
              )}
            </Form.Item>       */}
              <Form.Item label="申报时间">
                {getFieldDecorator('time', {
                  rules: [
                    {
                      required: true,
                      message: '请选择起止日期',
                    },
                  ],
                  initialValue: [moment(limit.startTime), moment(limit.endTime)],
                })(
                  <RangePicker
                    style={{
                      width: '100%',
                    }}
                    showTime
                    placeholder={['开始日期', '结束日期']}
                  />,
                )}
              </Form.Item>
            </Form>
          </Modal>
          <Table loading={loading} columns={this.columns} dataSource={colleges} rowKey="id" />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Authority);
