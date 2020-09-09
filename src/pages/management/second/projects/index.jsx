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
import UpdateForm from './components/UpdateForm';
import {experimentType,majorCollege} from '@/utils/constant'
import {saveAs} from 'file-saver'
import styles from './style.less';

const FormItem = Form.Item;
const {TextArea} = Input
const { Option } = Select;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['待审核', '待上报', '已上报', '已驳回'];

/* eslint react/no-multi-comp:0 */
@connect(({  loading,second,global,user }) => ({
  loading: loading.models.second,
  projects:second.secondProjects,
  tabActiveKey:second.tabActiveKey,
  user:user.currentUser,
  amountLimit:global.amountLimit
}))
class TableList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    approvalType:1,
    mVisible:false,
    fundsModalVisible:false,
    funds:5000,
    text:''
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '指导老师',
      dataIndex: 'guidanceTeachers',
      render:(t)=>t?t.filter(item=>item.memberRole===1).map(item=>item.userName).join('、'):''
    },
    {
      title: '学院',
      dataIndex: 'subordinateCollege',
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render:(type)=>type===1?'普通':'重点',
      filters:[
        {
          text:'普通',
          value:1
        },
        {
          text:'重点',
          value:2
        }

      ],
      onFilter: (value, record) => record.projectType === value,
    },
    {
      title: '已选学生数',
      dataIndex: 'numberOfTheSelected',
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render:(type)=>experimentType[type],
      filters:Object.keys(experimentType).map((item)=>{
        return {
          text:experimentType[item],
          value:item
        }
      })
      ,
      onFilter: (value, record) => record.experimentType == value,

    },
    {
      title: '预申请金额',
      dataIndex:'applyFunds',
      filters:[
        {
          text:'500',
          value:500
        },
        {
          text:'2500',
          value:2500
        },
        {
          text:'3000',
          value:3000
        },
        {
          text:'5000',
          value:5000
        }

      ],
      onFilter: (value, record) => record.applyFunds == value,
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
        role:1
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:1
      }
    })
  }
  

  componentDidMount() {
    const { dispatch ,user:{institute}} = this.props;
    dispatch({
      type: 'second/fetchProjects',
      payload:{
        status:'0'
      }
    });
    dispatch({
      type:'global/fetchAmountLimit',
      payload:{
        college:institute,
        projectType:1
      }
    })
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
            <FormItem label="项目级别">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">普通</Option>
                  <Option value="1">重点</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="预申请金额">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">5000</Option>
                  <Option value="1">2500</Option>
                  <Option value="2">3000</Option>
                  <Option value="3">500</Option>
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
    const {dispatch} = this.props
    dispatch({
      type:'second/fetchProjects',
      payload:{
        status:tabActiveKey,
        data:{
          operationType:tabActiveKey,
          operationUnit:5
        }
      }
    })
    dispatch({
      type:'second/changeTabActiveKey',
      payload:tabActiveKey
    })
    this.setState({
      selectedRows:[]
    })
  };
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
      unit:1,
      data,
      type:approvalType,
      isDetail:true
    }
    console.log(payload)
    dispatch({
      type:'approval/normal',
      payload:{
        unit:1,
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
    const data = selectedRows.map(item=>item.id)
    dispatch({
      type:'approval/normal',
      payload:{
        unit:1,
        data,
        type:2,
        isDetail:false,
        status:tabActiveKey
      }
    })

  }
  showModifyFundsModal = ()=>{
    this.setState({
      fundsModalVisible:true
    })
  }
  onFundsChange = (e)=>{
    this.setState({
      funds:e
    })

  }
  handleModifyOk = ()=>{
    const {dispatch,tabActiveKey} = this.props
    const {selectedRows,funds} = this.state
    console.log(selectedRows)
    const projectIdList = selectedRows.map(item=>item.id)
    dispatch({
      type:'second/updateFunds',
      payload:{
        data:{
          fundsMount:funds,
          projectIdList
        },
        status:tabActiveKey
      }
    })
    this.setState({
      fundsModalVisible:false
    })
  }
  handleModifyCancel = ()=>{
    this.setState({
      fundsModalVisible:false
    })
  }
  showModifyFundsModal = ()=>{
    this.setState({
      fundsModalVisible:true
    })
  }
  handleExportExcel = (isInfo)=>{
    const {dispatch} = this.props
    if(!isInfo)
    dispatch({
      type:'second/export'
    })
    else{
      dispatch({
        type:'second/exportProjects'
      })
    }
  }
  render() {
    const action = (
      <div>
        {/* <span style={{marginRight:15}}>状态: <Badge status='processing'/>审核中</span> */}
        <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel()}>导出立项一览表</Button>
        <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel(1)}>导出项目信息表</Button>
      </div>
      
    );
    const {
      loading,
      projects,
      tabActiveKey,
      amountLimit,
      user
    } = this.props;
    console.log(111,tabActiveKey)
    const { selectedRows, modalVisible,fundsModalVisible,funds, updateModalVisible, stepFormValues ,approvalType,mVisible,text} = this.state;
    const btnDisable = selectedRows.length===0
    console.log('selectted',selectedRows)
    const hasSelected = selectedRows.length > 0;
    const content =<RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label={`${majorCollege[user.institute-1]?majorCollege[user.institute-1].cName:''}可申报普通项目数`}>{amountLimit.length>0?amountLimit[0].list[0].maxAmount:''}</Descriptions.Item>
        {/* <Descriptions.Item label="重点项目待审批数">45</Descriptions.Item> */}
        {/* <Descriptions.Item label="重点项目特殊资助项目数">
          <Statistic value={8} suffix="/ 24" />
        </Descriptions.Item>
        <Descriptions.Item label="普通项目待审批数">
          35
        </Descriptions.Item> */}
       
      </Descriptions>
    )}
  </RouteContext.Consumer>
    const extraContent = <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="重点项目已通过人数" value={30} suffix='/53' />
    </div>
    <div className={styles.statItem}>
      <Statistic title="普通项目通过人数" value={8} suffix="/ 24" />
    </div>
  </div>
    return (
      <PageHeaderWrapper
      extra={action}
      content={content}
      // extraContent={extraContent}
      tabActiveKey={tabActiveKey}
      onTabChange={this.onTabChange}
      tabList={[
        {
          key: '0',
          tab: '待审批',
        },
        {
          key: '1',
          tab: '待上报',
        },
        {
          key: '2',
          tab: '已驳回',
        },
        {
          key: '3',
          tab: '已上报',
        },
        
      ]}
      >
        <Modal
        visible={fundsModalVisible}
        onOk={this.handleModifyOk}
        onCancel={this.handleModifyCancel}
        width={400}
        >
          <Select style={{width:"80%"}} value={funds} onChange={this.onFundsChange}>
            <Option value={5000}>5000元</Option>
            <Option value={3000}>3000元</Option>
            <Option value={2500}>2500元</Option>
          </Select>

        </Modal>
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
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            {tabActiveKey!=='2'&&tabActiveKey!=='3'&&<div className={styles.tableListOperator}>
             
              {tabActiveKey==='0'&&<Button type="primary" disabled={btnDisable} onClick={()=>{this.showApprovalModal(1)}}>
                批准
              </Button>}
              {tabActiveKey==='1'&&<span> 
                <Button disabled={btnDisable} type="primary" onClick={()=>{this.handleReportClick()}}>
                  上报
                </Button>
                <Button disabled={btnDisable} onClick={()=>{}}>
                  修改审批意见
                </Button>
              </span>}
              <Button disabled={btnDisable} onClick={()=>this.showApprovalModal(0)}>驳回</Button> 
              <Button disabled={btnDisable} onClick={()=>this.showModifyFundsModal()}>修改金额</Button>
              
            </div>
            
            }
            <span style={{ marginLeft: 8 }}>
                {hasSelected ? `已选中 ${selectedRows.length} 项` : ''}
              </span>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey = 'id' 
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              pagination={{pageSize:12}}
              onChange={this.handleStandardTableChange}
            />
          </div>
         
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
