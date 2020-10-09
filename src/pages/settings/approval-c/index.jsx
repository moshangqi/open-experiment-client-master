import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Table, Divider, Tag, Card, Popconfirm, Button, Modal, Select, Form, message } from 'antd';
import { majorCollege } from '@/utils/constant';

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

@connect(({ firstApproval }) => ({
  approval: firstApproval.approvalList,
}))
class Approval extends Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'firstApproval/fetch',
    });
  }

  deleteApproval = id => {
    console.log(id);
    const { dispatch } = this.props;
    dispatch({
      type: 'firstApproval/delete',
      payload: { id: id },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  addApproval = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      console.log(values);
      let projectReviewForms = values.collegeIds.reduce(
        (init, item) => [...init, { college: item, projectType: values.projectType }],
        [],
      );
      dispatch({
        type: 'firstApproval/add',
        payload: projectReviewForms,
      });
    });
    this.setState({
      visible: false,
    });
  };

  columns = [
    {
      title: '学院',
      dataIndex: 'college',
      render: text => <a>{majorCollege[text - 1].cName}</a>,
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      render: text => <span>{text === 1 ? '普通项目' : '重点项目'}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Popconfirm
          title="是否关闭该学院的立项评审？"
          onConfirm={() => this.deleteApproval(record.id)}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  render() {
    const data = this.props.approval;
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const title = (
      <Button type="primary" onClick={this.showModal}>
        添加立项评审学院
      </Button>
    );
    const formLayout = {
      wrapperCol: {
        span: 16,
      },
      labelCol: {
        span: 6,
      },
    };
    return (
      <PageHeaderWrapper>
        <Card title={title}>
          <Table columns={this.columns} dataSource={data} />
          <Modal
            title="添加立项评审学院"
            visible={visible}
            onOk={this.addApproval}
            onCancel={this.handleCancel}
          >
            <Form {...formLayout}>
              <Form.Item label="需评审学院">
                {getFieldDecorator('collegeIds', {
                  initialValue: [],
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择学院"
                    onChange={this.handleChange}
                  >
                    {majorCollege.map(item => (
                      <Option key={item.cId}>{item.cName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="评审项目类型">
                {getFieldDecorator('projectType', {
                  initialValue: '1',
                })(
                  <Select>
                    <Option value="1">普通项目</Option>
                    <Option value="2">重点项目</Option>
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Approval);
