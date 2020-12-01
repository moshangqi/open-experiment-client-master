import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Divider, Button, Modal, Form, Input, Select } from 'antd';
import { majorCollege } from '@/utils/constant';
import styles from './style.less';

@connect(({ approvalProject }) => ({
  project: approvalProject.project,
  loading: approvalProject.loading,
}))
class ApprovalProject extends Component {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
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
        return t === 0 ? '职能部门' : (majorCollege.find( item => item.cId == t)|| {}).cName; // majorCollege[t - 1].cName 占时修改
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

  handleDetailClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/fetchDetail',
      payload: {
        projectGroupId: id,
        role: 16,
      },
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalProject/fetch',
    });
  }

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
        type: 'approvalProject/score',
        payload: collegeGiveScores,
      });
    });
    this.setState({
      visible: false,
      selectedRowKeys: [],
    });
  };

  render() {
    const { selectedRowKeys, visible } = this.state;
    const { project } = this.props;
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
        <Card title="立项项目审理" style={{ marginTop: 15 }}>
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
export default Form.create()(ApprovalProject);
