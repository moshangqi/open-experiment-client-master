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
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import { experimentType } from '@/utils/constant';
import { projectType, statusType } from '@/utils/constant';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['待审核', '待上报', '已上报', '已驳回'];
const keyStatus = {
  '-9': '职能部门立项审核退回修改',
  '-8': '实验室审核通过，立项评审中',
  '-7': '职能部门结题审核退回修改',
  '-6': '学院结题审核退回修改',
  '-5': '中期打回修改',
  '-4': '重点申请',
  '-3': '项目已被终止',
  '-2': '驳回修改',
  '-1': '待指导老师确认',
  '0': '指导老师确认',
  '1': '拟题审核通过', //'实验室待上报',
  '2': '实验室已上报',
  '3': '二级单位待上报',
  '4': '二级单位已上报',
  '5': '职能部门审核通过，立项',
  '6': '学院结题提交',
  '7': '项目结题',
};
/* eslint react/no-multi-comp:0 */
@connect(({ lab, loading, labKeyProjects }) => ({
  labProjects: labKeyProjects.labProjects,
  loading: loading.models.labKeyProjects,
  tabActiveKey: labKeyProjects.tabActiveKey,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    tabActiveKey: '0',
    approvalType: 1,
    mVisible: false,
    experimentType: undefined,
    projectType: undefined,
    money: '',
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '指导老师',
      dataIndex: 'guidanceTeachers',
      render: t => {
        return t ? t.map(item => item.userName).join('、') : '';
      },
    },
    {
      title: '实验室',
      dataIndex: 'labName',
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render: type => (type === 1 ? '普通' : '重点'),
      filters: [
        {
          text: '普通',
          value: 1,
        },
        {
          text: '重点',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.projectType === value,
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render: type => experimentType[type],
      filters: Object.keys(experimentType).map(item => {
        return {
          text: experimentType[item],
          value: item,
        };
      }),
      onFilter: (value, record) => record.experimentType == value,
    },
    {
      title: '已选人数',
      dataIndex: 'numberOfTheSelected',
    },

    {
      title: '计划实验时间',
      render: project => (
        <span>
          {moment(project.startTime).format('YYYY-MM-DD') +
            '~' +
            moment(project.endTime).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: id => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>
          
          <Divider type="vertical" /> */}
          <a onClick={() => this.handleDetailClick(id)}>查看详情</a>
        </Fragment>
      ),
    },
  ];

  allColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '指导老师',
      dataIndex: 'guidanceTeachers',
      render: t => {
        return t ? t.map(item => item.userName).join('、') : '';
      },
    },
    {
      title: '实验室',
      dataIndex: 'labName',
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render: type => (type === 1 ? '普通' : '重点'),
      filters: [
        {
          text: '普通',
          value: 1,
        },
        {
          text: '重点',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.projectType === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        // console.log(text,record)
        //key -1 待确认
        //key 0 指导老师确认
        // status 0 申报
        console.log(record.keyStatus, record.status);
        return (
          <span>
            {record.keyStatus !== null
              ? keyStatus[record.keyStatus]
              : record.status
              ? statusType[record.status]
              : ''}
          </span>
        );
      },
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render: type => experimentType[type],
      filters: Object.keys(experimentType).map(item => {
        return {
          text: experimentType[item],
          value: item,
        };
      }),
      onFilter: (value, record) => record.experimentType == value,
    },
    {
      title: '已选人数',
      dataIndex: 'numberOfTheSelected',
    },

    {
      title: '计划实验时间',
      render: project => (
        <span>
          {moment(project.startTime).format('YYYY-MM-DD') +
            '~' +
            moment(project.endTime).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: id => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>
          
          <Divider type="vertical" /> */}
          <a onClick={() => this.handleDetailClick(id)}>查看详情</a>
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
        role: 0,
        projectType: 2,
      },
    });
    dispatch({
      type: 'detail/fetchProcess',
      payload: {
        projectId: id,
        role: 0,
        projectType: 2,
      },
    });
  };
  editWarning = () => {
    Modal.warning({
      title: '提醒',
      content: '编辑申请表会导致审核重新开始',
      okText: '知道了',
      onOk: () => {
        this.props.history.push('/tproject/manage/edit');
      },
    });
  };

  componentDidMount() {
    const { dispatch, tabActiveKey } = this.props;
    dispatch({
      type: 'labKeyProjects/fetchProjects',
      payload: {
        status: tabActiveKey,
        data: {
          operationType: tabActiveKey,
          operationUnit: 4,
        },
      },
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

  handleSearchClick = () => {
    const { form } = this.props;
    this.setState({
      formValues: form.getFieldsValue(),
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { experimentType } = this.state;
    const { projectType } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="项目级别">
              {getFieldDecorator('experimentType')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value={0}>普通</Option>
                  <Option value={1}>重点</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="实验类型">
              {getFieldDecorator('projectType')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {Object.keys(experimentType).map(item => {
                    return (
                      <Option key={item} value={item}>
                        {experimentType[item]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearchClick}>
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
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  onTabChange = tabActiveKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labKeyProjects/fetchProjects',
      payload: {
        status: tabActiveKey,
        data: {
          operationType: tabActiveKey,
          operationUnit: 4,
        },
      },
    });
    dispatch({
      type: 'labKeyProjects/changeTabActiveKey',
      payload: tabActiveKey,
    });
  };
  hideModal = () => {
    this.setState({
      mVisible: false,
    });
  };
  showModal = () => {
    this.setState({
      mVisible: true,
    });
  };
  handleModalCancel = () => {
    this.setState({
      mVisible: false,
    });
  };
  handleModalOk = () => {
    const { selectedRows, text, approvalType, money } = this.state;
    const { dispatch } = this.props;
    const data = selectedRows.map(item => {
      if (approvalType == 3) {
        return {
          reason: text,
          projectId: item.id,
          applyFunds: money,
        };
      }
      return {
        reason: text,
        projectId: item.id,
      };
    });
    let payload = {
      unit: 0,
      data,
      type: approvalType,
      isDetail: true,
    };

    dispatch({
      type: 'approval/key',
      payload: {
        unit: 0,
        data,
        type: approvalType,
        isDetail: false,
      },
    });
    this.setState({ mVisible: false, text: '', selectedRows: [] });
  };
  handleReportClick = () => {
    const { selectedRows, text, approvalType } = this.state;
    const { dispatch, tabActiveKey } = this.props;
    const data = selectedRows.map(item => ({ projectId: item.id, reason: '' }));
    dispatch({
      type: 'approval/key',
      payload: {
        unit: 0,
        data,
        type: 2,
        isDetail: false,
        status: tabActiveKey,
      },
    });
  };
  showApprovalModal = type => {
    this.setState({
      approvalType: type,
      mVisible: true,
    });
  };
  handleInputChange = e => {
    this.setState({
      text: e.target.value,
    });
  };
  handleExportExcel = isInfo => {
    const { dispatch } = this.props;
    if (!isInfo)
      dispatch({
        type: 'second/export',
      });
    else {
      dispatch({
        type: 'second/exportProjects',
      });
    }
  };
  render() {
    const { loading, labProjects, tabActiveKey } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      approvalType,
      mVisible,
      text,
      formValues,
    } = this.state;
    let projects = labProjects
      .filter(item => {
        return formValues.projectType ? item.projectType === formValues.projectType : true;
      })
      .filter(item => {
        return formValues.experimentType !== undefined
          ? item.experimentType === formValues.experimentType
          : true;
      });
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const btnDisable = selectedRows.length === 0;
    const hasSelected = selectedRows.length > 0;
    const extra = (
      <div>
        <Button
          icon="export"
          type="primary"
          style={{ marginRight: 15 }}
          onClick={() => this.handleExportExcel()}
        >
          导出学院上报项目
        </Button>
        <Button
          icon="export"
          type="primary"
          style={{ marginRight: 15 }}
          onClick={() => this.handleExportExcel(1)}
        >
          导出学院所有项目信息
        </Button>
      </div>
    );
    const modalText = ['驳回理由', '审核意见', '', '转普通立项'];
    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        extra={extra}
        tabList={[
          {
            key: '0',
            tab: '待审批',
          },
          {
            key: '1',
            tab: '查看所有',
          },
          {
            key: '3',
            tab: '已通过',
          },
          {
            key: '2',
            tab: '已驳回',
          },
          {
            key: '4',
            tab: '立项评审中',
          },
        ]}
      >
        <Modal
          visible={mVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          title={modalText[approvalType]}
        >
          {approvalType == 3 && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ paddingRight: '20px' }}>输入金额:</span>
              <Select
                placeholder="修改金额"
                onChange={e => {
                  this.setState({ money: e });
                }}
                style={{ width: '340px' }}
              >
                <Select.Option value="200">200元</Select.Option>
                <Select.Option value="300">300元</Select.Option>
                <Select.Option value="500">500元</Select.Option>
              </Select>
            </div>
          )}
          <TextArea
            onChange={this.handleInputChange}
            style={{ height: 150 }}
            value={text}
            placeholder={approvalType === 0 ? '驳回理由' : '审核意见'}
          />
        </Modal>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            {tabActiveKey !== '2' && tabActiveKey !== '3' && tabActiveKey !== '4' && (
              <div className={styles.tableListOperator}>
                {tabActiveKey === '0' && (
                  <Button
                    type="primary"
                    disabled={btnDisable}
                    onClick={() => {
                      this.showApprovalModal(1);
                    }}
                  >
                    批准
                  </Button>
                )}
                {/* {tabActiveKey==='1'&&<span> 
                <Button disabled={btnDisable} type="primary" onClick={()=>{this.handleReportClick()}}>
                  上报
                </Button>
                <Button disabled={btnDisable} onClick={()=>{}}>
                  修改审批意见
                </Button>
              </span>} */}
                {tabActiveKey !== '1' && (
                  <Button disabled={btnDisable} onClick={() => this.showApprovalModal(0)}>
                    驳回
                  </Button>
                )}
                {tabActiveKey === '0' && (
                  <Button
                    type="primary"
                    disabled={btnDisable}
                    onClick={() => {
                      this.showApprovalModal(3);
                    }}
                  >
                    转普通立项
                  </Button>
                )}
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `已选中 ${selectedRows.length} 项` : ''}
                </span>
              </div>
            )}

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              columns={tabActiveKey === '1' ? this.allColumns : this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{ pageSize: 12 }}
              rowKey="id"
            />
          </div>
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
