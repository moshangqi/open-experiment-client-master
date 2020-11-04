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
  Statistic,
  Descriptions,
} from 'antd';
import React, { Component, Fragment, useRef } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import {
  experimentType,
  major,
  college,
  grade,
  suggestGroupType,
  majorCollege,
} from '@/utils/constant';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['待审核', '待上报', '已上报', '已驳回'];

const ReasonModle = props => {
  const { visible, reason, title, onCancel, onOk } = props;
  const inputRef = useRef();
  const handleOn = () => {
    onOk(inputRef.current.state.value);
  };
  return (
    <Modal visible={visible} title={title} onCancel={onCancel} onOk={handleOn}>
      <TextArea placeholder={reason} ref={inputRef} style={{ height: 200 }}></TextArea>
    </Modal>
  );
};

/* eslint react/no-multi-comp:0 */
@connect(({ listTableList, loading, equipment }) => ({
  listTableList,
  loading: loading.models.equipment,
  projects: equipment.projects,
  tabActiveKey: equipment.tabActiveKey,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    modalVisible1: false, // 驳回弹出层
    modalVisible2: false, //复核通过弹出层
    modalVisible3: false, //审核通过弹出层
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
      title: '项目级别',
      dataIndex: 'projectType',
      render: type => (type === 1 ? '普通' : '重点'),
    },
    {
      title: '已选学生数',
      dataIndex: 'numberOfTheSelected',
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render: type => experimentType[type],
    },
    {
      title: '预申请金额',
      dataIndex: 'applyFunds',
      render: funds => {
        return (
          <div>
            <span>{funds}</span>
            {/* <a style={{marginLeft:15}} onClick={this.showModal} href="javasctipt:">修改</a> */}
          </div>
        );
      },
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

  handleFilter = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      console.log(values);
      let payload = {
        ...values,
        startTime: values.date && values.date[0].format('x'),
        endTime: values.date && values.date[1].format('x'),
      };
      delete payload.date;
      dispatch({
        type: 'equipment/filter',
        payload,
      });
    });
  };
  handleDetailClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/fetchDetail',
      payload: {
        projectGroupId: id,
        role: 2,
      },
    });
    dispatch({
      type: 'detail/fetchProcess',
      payload: {
        projectId: id,
        role: 2,
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
      type: 'equipment/fetchProjects',
      payload: {
        status: tabActiveKey,
        data: {
          operationType: tabActiveKey === '2' ? '3' : '2',
          operationUnit: 6,
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
    dispatch({
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开放学院">
              {getFieldDecorator('college')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {majorCollege.map(item => {
                    return (
                      <Option key={item.cId} value={item.cId}>
                        {item.cName}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="建议审分组">
              {getFieldDecorator('suggestGroupType')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {Object.keys(suggestGroupType).map(item => {
                    return (
                      <Option key={item} value={item}>
                        {suggestGroupType[item]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="申报日期">
              {getFieldDecorator('date')(
                <RangePicker
                  allowClear={false}
                  style={{
                    width: '100%',
                  }}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="预申请资金">
              {getFieldDecorator('applyFunds')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value={2500}>2500元</Option>
                  <Option value={3000}>3000元</Option>
                  <Option value={5000}>5000元</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div
          style={{
            float: 'right',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              float: 'right',
              marginBottom: 24,
            }}
          >
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
            <a
              style={{
                marginLeft: 8,
              }}
              onClick={this.toggleForm}
            >
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }
  renderSimpleForm() {
    const { form } = this.props;
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
            <FormItem label="开放学院">
              {getFieldDecorator('college')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {majorCollege.map(item => {
                    return (
                      <Option key={item.cId} value={item.cId}>
                        {item.cName}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="建议审分组">
              {getFieldDecorator('suggestGroupType')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {Object.keys(suggestGroupType).map(item => {
                    return (
                      <Option key={item} value={item}>
                        {suggestGroupType[item]}
                      </Option>
                    );
                  })}
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
              <a
                style={{
                  marginLeft: 8,
                }}
                onClick={this.toggleForm}
              >
                展开 <Icon type="down" />
              </a>
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
  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/fetchProjects',
      payload: {
        status: tabActiveKey,
        data: {
          operationType: tabActiveKey === '2' ? '3' : '2',
          operationUnit: 6,
        },
      },
    });
    dispatch({
      type: 'equipment/changeTabActiveKey',
      payload: tabActiveKey,
    });
  };
  handleExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/export',
    });
  };
  handleBack = reason => {
    const { selectedRows } = this.state;
    const data = selectedRows.reduce(
      (res, item) => [...res, { projectId: item.id, reason: reason }],
      [],
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/hitback',
      payload: data,
    });
    this.hideModal1();
    this.setState({
      selectedRows: [],
      formValues: {},
    });
    // console.log(this.state)
  };
  showModal1 = () => {
    this.setState({
      modalVisible1: true,
    });
  };

  hideModal1 = () => {
    this.setState({
      modalVisible1: false,
    });
  };

  hideMyModal = () => {
    this.setState({
      modalVisible2: false,
    });
  };

  handleReview = reason => {
    const { selectedRows } = this.state;
    const data = selectedRows.reduce(
      (res, item) => [...res, { projectId: item.id, reason: reason }],
      [],
    );
    console.log(data);
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/reviewPassed',
      payload: data,
    });
    this.hideMyModal();
    this.setState({
      selectedRows: [],
      formValues: {},
    });
    // const {dispatch} = this.props;
  };

  showMyModal = () => {
    this.setState({
      modalVisible2: true,
    });
  };

  showModal3 = () => {
    this.setState({
      modalVisible3: true,
    });
  };

  hideModal3 = () => {
    this.setState({
      modalVisible3: false,
    });
  };

  handelPassed = reason => {
    const { selectedRows } = this.state;
    const data = selectedRows.reduce(
      (res, item) => [...res, { projectId: item.id, reason: reason }],
      [],
    );
    console.log(data);
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/agree',
      payload: data,
    });
    this.hideModal3();
    this.setState({
      selectedRows: [],
      formValues: {},
    });
  };

  render() {
    const action = (
      <div>
        <Button
          icon="export"
          type="primary"
          style={{ marginRight: 15 }}
          onClick={this.handleExport}
        >
          导出结题验收一览表
        </Button>
        {/* <Button >关闭/开启学院审核</Button> */}
      </div>
    );
    const { loading, projects, tabActiveKey } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      modalVisible1,
      modalVisible2,
      modalVisible3,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const btnDisable = selectedRows.length === 0;
    const content = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="下级待审核数">56</Descriptions.Item>
            <Descriptions.Item label="重点项目待审批总数">
              <Statistic value={300} suffix="/ 350" />
            </Descriptions.Item>
            <Descriptions.Item label="重点项目特殊资助项目数">
              <Statistic value={50} suffix="/ 60" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <Countdown
            title="立项截止剩余"
            valueStyle={{ fontSize: 17 }}
            value={deadline}
            format="D 天 H 时 m 分 s 秒"
          />
        </div>
        <div className={styles.statItem}>
          <Countdown
            title="审核截止剩余"
            valueStyle={{ fontSize: 17 }}
            value={deadline}
            format="D 天 H 时 m 分 s 秒"
          />
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper
        extra={action}
        //content={content}
        //extraContent={extraContent}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={[
          {
            key: '0',
            tab: '待审批',
          },
          {
            key: '1',
            tab: '待复核',
          },
          {
            key: '3',
            tab: '立项失败', //已驳回
          },
          {
            key: '2',
            tab: '已审批',
          },
        ]}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {tabActiveKey !== 'reported' && tabActiveKey !== 'reject' && (
              <div className={styles.tableListOperator}>
                {tabActiveKey === 'auth' && (
                  <Button type="primary" disabled={btnDisable} onClick={() => {}}>
                    批准立项
                  </Button>
                )}
                {tabActiveKey === 'report' && (
                  <span>
                    <Button disabled={btnDisable} type="primary" onClick={() => {}}>
                      上报
                    </Button>
                    <Button disabled={btnDisable} onClick={() => {}}>
                      修改审批意见
                    </Button>
                  </span>
                )}
                {tabActiveKey == 0 && (
                  <Button onClick={this.showModal1} disabled={btnDisable}>
                    退回修改
                  </Button>
                )}
                {tabActiveKey == 0 ? (
                  <Button onClick={this.showModal3} disabled={btnDisable}>
                    审核
                  </Button>
                ) : (
                  ''
                )}
                {tabActiveKey == 1 && (
                  <Button onClick={this.showMyModal} disabled={btnDisable}>
                    复核通过
                  </Button>
                )}
              </div>
            )}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey="id"
              columns={this.columns}
              pagination={{ pageSize: 12 }}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            visible={modalVisible}
            onCancel={this.hideModal}
            footer={<Button type="primary">确认修改</Button>}
          >
            <Timeline>
              <Timeline.Item color="green">
                <p>实验室已上报 2017-08-23</p>
                <p>审核意见：符合要求审核通过。。。。</p>
              </Timeline.Item>
              <Timeline.Item color="red">
                <p>实验室已驳回，操作人：XXX 2017-08-23</p>
                <p>
                  驳回原因：未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求
                </p>
              </Timeline.Item>
              <Timeline.Item>
                <p>实验室待上报 2017-09-12</p>
                <p>审核意见：符合要求审核通过。。。。</p>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <p>实验室待待审核</p>
              </Timeline.Item>
            </Timeline>
            ,
          </Modal>

          <ReasonModle
            visible={modalVisible1}
            title={'退回理由'}
            reason={'退回理由'}
            onCancel={this.hideModal1}
            onOk={this.handleBack}
          />

          <ReasonModle
            visible={modalVisible2}
            title={'复核通过'}
            reason={'通过理由'}
            onCancel={this.hideMyModal}
            onOk={this.handleReview}
          />

          <ReasonModle
            visible={modalVisible3}
            title={'审核通过'}
            reason={'通过理由'}
            onCancel={this.hideModal3}
            onOk={this.handelPassed}
          />

          {/* <Modal 
            visible= {modalVisible1} 
            onOk = {this.handleBack}
            title = {'退回理由'}
            onCancel = {this.hideModal1}
          >
          <TextArea 
            placeholder={'退回理由'}
            style={{height:200}}
            // value={text}
            // onChange={this.onTextChange}
            ></TextArea>
          </Modal> */}

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
