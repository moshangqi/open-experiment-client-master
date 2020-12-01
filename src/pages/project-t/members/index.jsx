import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Modal,
  Timeline,
  Select,
  message,
  Descriptions,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import { projectType, memberRole, experimentType, major } from '@/utils/constant';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'success', 'error'];
const status = ['待审核', '已通过', '已拒绝'];

/* eslint react/no-multi-comp:0 */
@connect(({ loading, applyStudents, tprojects }) => ({
  loading: loading.models.applyStudents,
  students: applyStudents.data,
  projects: tprojects.projects,
  searchStudents: applyStudents.searchStudents,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    detailModalVisible: false,
    apply: {},
    setLeaderModalVisible: false,
    role: '3',
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '申请人',
      dataIndex: 'realName',
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render: type => {
        return type === 1 ? '普通' : '重点';
      },
    },
    {
      title: '专业',
      dataIndex: 'major',
      render: m => { (major.find( item => item.mId == m) || {} ).mName }, // (major[m - 1] ? major[m - 1].mName : null),
    },
    {
      title: '年级',
      dataIndex: 'grade',
      render: val => {
        return val + '级';
      },
    },
    {
      title: '项目角色',
      dataIndex: 'memberRole',
      render: val => {
        return memberRole[val];
      },
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render: type => experimentType[type],
    },
    {
      title: '状态',
      dataIndex: 'status',

      render: val => {
        return (
          <span>
            <Badge status={statusMap[val - 1]} text={status[val - 1]} />
          </span>
        );
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          <a onClick={() => this.showDetailModal(val)}>详情</a>
          {/* <Divider type="vertical" /> */}
        </Fragment>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'applyStudents/fetch',
    // });

    //取消成员审批的第一次默认加载  this.handleFilter();
    // this.handleFilter();
    dispatch({
      type: 'tprojects/fetch',
      payload: {},
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleFilter = e => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'applyStudents/filter',
        payload: values,
      });
    });
  };

  hideSetLeaderModal = () => {
    this.setState({
      setLeaderModalVisible: false,
    });
  };
  showSetLeaderModal = () => {
    this.setState({
      setLeaderModalVisible: true,
    });
  };
  handleAdd = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
        modalVisible: false,
      });
      dispatch({
        type: 'applyStudents/add',
        payload: values,
        filterData: values,
      });
    });
    this.setState({
      selectedRows: [],
    });
  };

  renderSimpleForm() {
    const { form, projects } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleFilter} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('id')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {projects.map((item, index) => {
                    return (
                      <Option key={index} value={item.id}>
                        {item.projectName}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">已通过</Option>
                  <Option value="3">已拒绝</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleFilter}>
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }
  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  showDetailModal = apply => {
    this.setState({
      detailModalVisible: true,
      apply,
    });
  };
  hideDetailModal = () => {
    this.setState({
      detailModalVisible: false,
    });
  };
  handleAgree = () => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;
    let payload = selectedRows.map(item => {
      return {
        projectGroupId: item.id,
        reason: '',
        userId: item.code,
      };
    });
    form.validateFields((err, values) => {
      dispatch({
        type: 'applyStudents/agree',
        payload,
        filterData: values,
      });
    });
    this.setState({
      selectedRows: [],
    });
  };
  handleReject = () => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;
    confirm({
      title: '确认拒绝以下成员申请?',
      content: `${selectedRows.map(item => item.realName).join('、')}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        let payload = selectedRows.map(item => {
          return {
            projectGroupId: item.id,
            reason: '',
            userId: item.code,
          };
        });
        form.validateFields((err, values) => {
          dispatch({
            type: 'applyStudents/reject',
            payload,
            filterData: values,
          });
        });
        this.setState({
          selectedRows: [],
        });
      },
      onCancel: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };
  handleRemove = () => {
    const { selectedRows } = this.state;
    const { form, dispatch } = this.props;
    confirm({
      title: `确定删除成员${selectedRows[0].realName}?`,
      content: `${selectedRows[0].projectName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        if (selectedRows.length > 1) {
          message.warning('不能批量移除成员');
          return;
        }
        let payload = {
          projectId: selectedRows[0].id,
          userId: selectedRows[0].code,
        };
        form.validateFields((err, values) => {
          dispatch({
            type: 'applyStudents/remove',
            payload,
            filterData: values,
          });
        });
        this.setState({
          selectedRows: [],
        });
      },
      onCancel: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };
  handleSetLeader = () => {
    const { form } = this.props;
    const { selectedRows, role } = this.state;
    if (selectedRows.length > 1) {
      message.warning('该操作不能批量进行');
      this.setState({
        selectedRows: [],
        setLeaderModalVisible: false,
      });
      return;
    }
    if (!role) {
      message.warning('请选择角色');
      this.setState({
        selectedRows: [],
        setLeaderModalVisible: false,
      });
      return;
    }
    const { dispatch } = this.props;

    let payload = {
      projectGroupId: selectedRows[0].id,
      reason: '',
      userId: selectedRows[0].code,
      memberRole: role,
    };
    form.validateFields((err, values) => {
      dispatch({
        type: 'applyStudents/setLeader',
        payload,
        filterData: values,
      });
    });
    this.setState({
      selectedRows: [],
      setLeaderModalVisible: false,
    });
  };
  handleSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      this.fetchStudents(value);
    } else {
      dispatch({
        type: 'applyStudents/saveStudents',
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
        type: 'applyStudents/fetchStudents',
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
  onSelectRoleChange = e => {
    this.setState({
      role: e,
    });
  };
  render() {
    const { loading, students, form, projects, searchStudents } = this.props;
    const { getFieldDecorator } = form;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      detailModalVisible,
      apply,
      setLeaderModalVisible,
    } = this.state;
    const btnDisable = selectedRows.length === 0;
    const studentsWithKey = students.map((item, index) => ({ key: index, ...item }));
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" onClick={this.handleSetLeader}>
          设为组长
        </Menu.Item>
        <Menu.Item key="approval" onClick={this.handleRemove}>
          删除成员
        </Menu.Item>
      </Menu>
    );
    const hasSelected = selectedRows.length > 0;
    const options = searchStudents
      .map((s, index) => (
        <Option key={index} value={s.code}>
          <span>{s.realName}</span>
          <span style={{ margin: '0 30px' }}>{s.code}</span>
          <span>{(major.find(item => item.mId === s.major) || {}).mName}</span>
        </Option>
      ))
      .slice(0, 50);
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showModal}>
                增添成员
              </Button>

              <span>
                <Button type="primary" disabled={btnDisable} onClick={this.handleAgree}>
                  通过
                </Button>
                <Button onClick={this.handleReject} disabled={btnDisable}>
                  拒绝
                </Button>
                <Button onClick={this.showSetLeaderModal} disabled={btnDisable}>
                  更改成员角色
                </Button>
                <Button type="danger" onClick={this.handleRemove} disabled={btnDisable}>
                  删除成员
                </Button>
                <span style={{ marginLeft: 15 }}>
                  {hasSelected ? `已选中 ${selectedRows.length} 项` : ''}
                </span>
                {/* <Dropdown overlay={menu} disabled={btnDisable}>
                    <Button disabled={btnDisable}>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
              </span>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={studentsWithKey}
              rowKey="key"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              pagination={{ pageSize: 10 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            visible={setLeaderModalVisible}
            onOk={() => this.handleSetLeader()}
            onCancel={this.hideSetLeaderModal}
            width="400px"
          >
            <Select
              placeholder="请选择"
              style={{
                width: '90%',
              }}
              value={this.state.role}
              onChange={this.onSelectRoleChange}
            >
              <Option value="2">项目组长</Option>
              <Option value="3">普通成员</Option>
            </Select>
          </Modal>
          <Modal
            title="添加项目成员"
            visible={modalVisible}
            onCancel={this.hideModal}
            onOk={this.handleAdd}
            width={450}
          >
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
            >
              <FormItem label="项目名称">
                {getFieldDecorator('projectGroupId')(
                  <Select
                    placeholder="请选择"
                    style={{
                      width: '100%',
                    }}
                  >
                    {projects.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.projectName}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="学生">
                {getFieldDecorator('userId')(
                  <Select
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    notFoundContent={null}
                    onSelect={this.handleSelect}
                    placeholder="姓名或学号"
                  >
                    {options}
                  </Select>,
                )}
              </FormItem>
            </Form>
          </Modal>
          <Modal
            visible={detailModalVisible}
            onCancel={this.hideDetailModal}
            onOk={this.hideDetailModal}
            width={700}
          >
            <Descriptions column={2}>
              <Descriptions.Item label="姓名">{apply.realName}</Descriptions.Item>
              <Descriptions.Item label="学号">{apply.code}</Descriptions.Item>
              <Descriptions.Item label="申请项目">{apply.projectName}</Descriptions.Item>
              <Descriptions.Item label="项目层次">
                {apply.projectType === 1 ? '普通' : '重点'}
              </Descriptions.Item>
              <Descriptions.Item label="QQ">{apply.qqNum}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{apply.mobilePhone}</Descriptions.Item>
              <Descriptions.Item label="专业">
              {  ( major.find(item => item.mId == apply.major) || {}).mName }
                {/* { major[apply.major - 1] && major[apply.major - 1].mName} */}
              </Descriptions.Item>
              <Descriptions.Item label="年级">{apply.grade + '级'}</Descriptions.Item>
              {/* <Descriptions.Item span={2} label='学习绩点'>
                <Descriptions bordered>
                  <Descriptions.Item label='学期一'>
                    3.3
                  </Descriptions.Item>
                  <Descriptions.Item label='学期2'>
                    3.3
                  </Descriptions.Item>
                  <Descriptions.Item label='学期3'>
                    3.3
                  </Descriptions.Item>
                  <Descriptions.Item label='学期4'>
                    3.3
                  </Descriptions.Item>
                  <Descriptions.Item label='学期5'>
                    3.3
                  </Descriptions.Item>
                  <Descriptions.Item label='学期6'>
                    3.3
                  </Descriptions.Item>
                </Descriptions>
              </Descriptions.Item> */}
              <Descriptions.Item span={2} label="个人特长">
                {apply.personJudge}
              </Descriptions.Item>
              {/* <Descriptions.Item span={2} label="已修课程及具备知识">
                {apply.technicalRole}
              </Descriptions.Item> */}
            </Descriptions>
          </Modal>
          {/* <CreateForm {...parentMethods} modalVisible={modalVisible} />
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null} */}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
