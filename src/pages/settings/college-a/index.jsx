import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Modal, Select, Input, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { roleNames } from '@/utils/constant';

const { Option } = Select;

@connect(({ approvalRole }) => ({
  roles: approvalRole.roles,
}))
class CollegeApproval extends Component {
  state = {
    mVisible: false,
  };

  columns = [
    {
      title: '工号',
      dataIndex: 'code',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '电话',
      dataIndex: 'mobilePhone',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: role => {
        return roleNames[role];
      },
    },
    {
      title: '操作',
      render: user => {
        return (
          <Popconfirm
            placement="topLeft"
            title={`确认删除该角色?`}
            onConfirm={() => this.handleDelete(user)}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalRole/fetch',
    });
  }

  showAddModal = () => {
    this.setState({
      mVisible: true,
    });
  };

  hideModal = () => {
    this.setState({
      mVisible: false,
    });
  };

  handleAddRole = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      dispatch({
        type: 'approvalRole/add',
        payload: values,
      });
    });
    this.setState({
      mVisible: false,
    });
  };

  handleDelete = user => {
    console.log(user);
    const userRoleForm = {
      roleId: user.role,
      userId: user.code,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalRole/delete',
      payload: userRoleForm,
    });
  };

  render() {
    const formLayout = {
      wrapperCol: {
        span: 18,
      },
      labelCol: {
        span: 4,
      },
    };
    const title = (
      <Button type="primary" onClick={this.showAddModal}>
        添加角色
      </Button>
    );
    const { mVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { roles } = this.props;
    return (
      <PageHeaderWrapper>
        <Card title={title}>
          <Modal
            onOk={this.handleAddRole}
            onCancel={this.hideModal}
            title="添加角色"
            visible={mVisible}
            width="450px"
          >
            <Form {...formLayout}>
              <Form.Item label="用户ID">
                {getFieldDecorator('userId')(<Input placeholder="请输入用户id"></Input>)}
              </Form.Item>
              <Form.Item label="角色">
                {getFieldDecorator('roleId')(
                  <Select>
                    <Option value="11">立项评审人</Option>
                    <Option value="9">学院结题审核人</Option>
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </Modal>
          <Table
            columns={this.columns}
            dataSource={roles}
            rowKey={item => `${item.code}_${item.role}`}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CollegeApproval);
