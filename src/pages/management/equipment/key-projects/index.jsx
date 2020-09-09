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
  Descriptions
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper,RouteContext } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import {experimentType,majorCollege,suggestGroupType} from '@/utils/constant'
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const {Countdown} = Statistic
const {TextArea} = Input
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['待审核', '待上报', '已上报', '已驳回'];

/* eslint react/no-multi-comp:0 */
@connect(({  loading ,equipmentKeyProjects}) => ({
  loading: loading.models.equipmentKeyProjects,
  projects:equipmentKeyProjects.projects,
  tabActiveKey:equipmentKeyProjects.tabActiveKey
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    tabActiveKey:'0',
    approvalType:1,
    mVisible:false,
    experimentType:undefined,
    projectType:undefined
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '指导老师',
      dataIndex: 'guidanceTeachers',
      render:(t)=>{
        return t?t.map(item=>item.userName).join('、'):''
      }
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render:(type)=>type===1?'普通':'重点'
    },
    {
      title: '已选学生数',
      dataIndex: 'numberOfTheSelected'
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render:(type)=>experimentType[type]

    },
    {
      title: '预申请金额',
      dataIndex:'applyFunds',
      render:(funds)=> {
        return (
          <div>
            <span>{funds}</span>
            {/* <a style={{marginLeft:15}} onClick={this.showModal} href="javasctipt:">修改</a> */}
          </div>

        );
      }
    },
    {
      title: '计划实验时间',
      render: project => <span>{moment(project.startTime).format('YYYY-MM-DD')+'~'+moment(project.endTime).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      dataIndex:'id',
      render: (id) => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>

          <Divider type="vertical" /> */}
          <a onClick={()=>this.handleDetailClick(id)}>查看详情</a>
        </Fragment>
      ),
    },
  ];
  handleDetailClick = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:2,
        projectType:2
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:2,
        projectType:2
      }
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentKeyProjects/fetchProjects',
      payload:{
        status:'0',
        data:{}
      }
    });
  }
  onTabChange = tabActiveKey => {
    const {dispatch} = this.props
    dispatch({
      type:'equipmentKeyProjects/fetchProjects',
      payload:{
        status:tabActiveKey,
        data:{
          operationType:tabActiveKey,
          operationUnit:6
        }
      }

    })
    dispatch({
      type:'equipmentKeyProjects/changeTabActiveKey',
      payload:tabActiveKey
    })
  };


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


  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  handleFilter = (e)=>{
    e.preventDefault()
    const {dispatch,form} = this.props
    form.validateFields((err,values)=>{
      console.log(values)
      let payload = {...values,
        startTime:values.date&&values.date[0].format('x'),
        endTime:values.date&&values.date[1].format('x')
      }
      delete payload.date
      dispatch({
        type:'equipmentKeyProjects/filter',
        payload
      })
    })

  }
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
              {getFieldDecorator('projectName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="学院">
              {getFieldDecorator('college')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {majorCollege.map(item=>{
                    return <Option key={item.cId} value={item.cId}>{item.cName}</Option>
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
                  {
                    Object.keys(suggestGroupType).map(item=>{
                      return <Option key={item} value={item}>{suggestGroupType[item]}</Option>
                    })
                  }
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

                />
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
                  <Option value={500}>500元</Option>
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
            float:'right',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              float: 'right',
              marginBottom: 24,
            }}
          >
            <Button type="primary" htmlType="submit">
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
      <Form onSubmit={this.handleFilter} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="学院">
              {getFieldDecorator('college')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  {majorCollege.map(item=>{
                    return <Option key={item.cId} value={item.cId}>{item.cName}</Option>
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
                  {
                    Object.keys(suggestGroupType).map(item=>{
                      return <Option key={item} value={item}>{suggestGroupType[item]}</Option>
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
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
  handleExport = ()=>{
    const {dispatch} = this.props
    dispatch({
      type:'equipment/export'
    })
  }
  hideModal = ()=>{
    this.setState({
      mVisible:false
    })
  }
  showModal = ()=>{
    this.setState({
      mVisible:true
    })
  }
  handleModalCancel = ()=>{
    this.setState({
      mVisible:false
    })
  }
  handleModalOk = ()=>{
    const {selectedRows,text,approvalType} = this.state
    const {dispatch,tabActiveKey} = this.props
    const data = selectedRows.map(item=>{
      return {
        reason:text,
        projectId:item.id
      }
    })
    let payload={
      unit:2,
      data,
      type:approvalType,
      isDetail:true
    }
    console.log(payload)
    dispatch({
      type:'approval/key',
      payload:{
        unit:2,
        data,
        type:approvalType,
        isDetail:false,
        status:tabActiveKey
      }
    })
    this.setState({mVisible:false,
    text:''
    })
  }

  showApprovalModal = (type)=>{
    this.setState({
      approvalType:type,
      mVisible:true
    })
  }
  handleInputChange = (e)=>{
    this.setState({
      text:e.target.value
    })
  }
  handleReportClick = ()=>{
    const {selectedRows,text,approvalType} = this.state
    const {dispatch,tabActiveKey} = this.props
    const data = selectedRows.map(item=>({projectId:item.id,reason:''}))
    dispatch({
      type:'approval/key',
      payload:{
        unit:2,
        data,
        type:2,
        isDetail:false,
        status:tabActiveKey
      }
    })

  }

  render() {
    const action = (
      <div>
        {/* <span style={{marginRight:15}}>状态: <Badge status='processing'/>审核中</span> */}
        <Button icon='export' type='primary' style={{marginRight:15}} onClick={this.handleExport}>导出结题验收一览表</Button>
        {/* <Button >关闭/开启学院审核</Button> */}
      </div>

    );
    const {
      loading,
      projects,
      tabActiveKey
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,mVisible,approvalType,text } = this.state;
   console.log(projects)
    const btnDisable = selectedRows.length===0
    const content =<RouteContext.Consumer>
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
    const extraContent = <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Countdown title="立项截止剩余" valueStyle={{fontSize:17}} value={deadline} format="D 天 H 时 m 分 s 秒" />

    </div>
    <div className={styles.statItem}>
      <Countdown title="审核截止剩余" valueStyle={{fontSize:17}} value={deadline} format="D 天 H 时 m 分 s 秒" />

    </div>
  </div>
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
          key: '2',
          tab: '已驳回',
        },
        {
          key: '1',
          tab: '已审批',
        },
      ]}
      >
        <Modal
        visible={mVisible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        title={approvalType===0?'驳回理由':'审核意见'}
        >
          <TextArea onChange={this.handleInputChange} style={{height:150}} value={text} placeholder={approvalType===0?'批量驳回理由':'批量审核意见'}/>

        </Modal>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>

              {tabActiveKey==='0'&&<Button type="primary" disabled={btnDisable} onClick={()=>{this.showApprovalModal(1)}}>
                批准立项
              </Button>}
            {tabActiveKey!=='2'&&<Button disabled={btnDisable} style={{
              marginLeft:15
            }} onClick={()=>this.showApprovalModal(0)}>驳回</Button> }
            </div>
            <StandardTable
              pagination={{pageSize:12}}
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey='id'
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            visible={modalVisible}
            onCancel={this.hideModal}
            footer={<Button type='primary'>确认修改</Button>}

          >
            <Timeline>
              <Timeline.Item color="green">
                <p>实验室已上报 2017-08-23</p>
                <p>审核意见：符合要求审核通过。。。。</p>
              </Timeline.Item>
              <Timeline.Item color="red">
                <p>实验室已驳回，操作人：XXX 2017-08-23</p>
                <p>驳回原因：未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求未达到要求</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>实验室待上报 2017-09-12</p>
                <p>审核意见：符合要求审核通过。。。。</p>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <p>实验室待待审核</p>
              </Timeline.Item>
            </Timeline>,

          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
