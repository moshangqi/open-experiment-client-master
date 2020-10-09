import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Modal, Form, Input, Select } from 'antd';
import { majorCollege } from '@/utils/constant';
import styles from '../project/style.less';

@connect(({ approvalKeyProject }) => ({
  project: approvalKeyProject.project,
  loading: approvalKeyProject.loading,
}))
class ApprovalKeyProject extends Component {
  state = {
    selectedRowKeys: [],
  };

  columns = [
    {
      title: '项目编号',
      dataIndex: 'serialNumber',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '所属学院',
      dataIndex: 'subordinateCollege',
      render: t => {
        return t === 0 ? '职能部门' : majorCollege[t - 1].cName;
      },
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render: type => (type === 1 ? '普通' : '重点'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: id => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>

          <Divider type="vertical" /> */}
          <a onClick={() => this.handleDetailClick(id)}>查看详情</a>
          {/* <Divider type="vertical" /> */}
          {/* <a onClick={()=>this.stopProject(id)}>中止项目</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalKeyProject/fetch',
    });
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hiddenModal = () => {
    this.setState({
      visible: false,
    });
  };

  scoreProject = () => {
    const { form, dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    form.validateFields((err, values) => {
      const collegeGiveScores = selectedRowKeys.reduce((init, item) => {
        return [...init, { ...values, projectId: item }];
      }, []);
      dispatch({
        type: 'approvalKeyProject/score',
        payload: collegeGiveScores,
      });
    });
    this.setState({
      visible: false,
      selectedRowKeys: [],
    });
  };

  handleDetailClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/fetchDetail',
      payload: {
        projectGroupId: id,
        role: 16,
        projectType: 2,
      },
    });
  };

  render() {
    const { selectedRowKeys, visible } = this.state;
    const { project, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const formLayout = {
      wrapperCol: {
        span: 18,
      },
      labelCol: {
        span: 4,
      },
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <PageHeaderWrapper>
        <Card title="立项项目审理">
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={this.showModal} disabled={!hasSelected}>
                  项目评分
                </Button>
              </div>
              <Table
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={project}
                rowKey={'id'}
                loading={loading}
              />
            </div>
          </div>
          <Modal
            visible={visible}
            title="项目评审意见"
            onCancel={this.hiddenModal}
            onOk={this.scoreProject}
          >
            <Form {...formLayout}>
              <Form.Item label="项目打分">{getFieldDecorator('score')(<Input />)}</Form.Item>
              <Form.Item label="打分理由">
                {getFieldDecorator('reason')(
                  <Input.TextArea autoSize={{ minRows: 3, maxRows: 20 }} />,
                )}
              </Form.Item>
              <Form.Item label="是否推荐">
                {getFieldDecorator('isSupport', {
                  initialValue: '1',
                })(
                  <Select>
                    <Select.Option value="0">不推荐</Select.Option>
                    <Select.Option value="1">推荐</Select.Option>
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

export default Form.create()(ApprovalKeyProject);
