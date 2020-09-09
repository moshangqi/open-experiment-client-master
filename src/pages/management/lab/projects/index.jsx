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
  Table
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import {experimentType, openType} from '@/utils/constant'
import {projectType} from '@/utils/constant'
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const {TextArea} = Input

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['待审核', '待上报', '已上报', '已驳回'];

/* eslint react/no-multi-comp:0 */
@connect(({ lab, loading }) => ({
  labProjects:lab.labProjects,
  loading: loading.models.lab,
  tabActiveKey:lab.tabActiveKey
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
    projectType:undefined,
    currentPage:2
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
      title: '实验室',
      dataIndex: 'labName',
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
      title:'已选人数',
      dataIndex:'numberOfTheSelected',
      
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
        role:0,
        reportToAgree:true
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:0
      }
    })
  }
  handleExportExcel = ()=>{
    const {dispatch} = this.props
    dispatch({
      type:'second/export'
    })
  }
  componentDidMount() {
    const { dispatch,tabActiveKey } = this.props;
    dispatch({
      type:'lab/fetchProjects',
      payload:{
        status:tabActiveKey,
        data:{
          operationType:tabActiveKey==='2'?'0':tabActiveKey,
          operationUnit:4
        }
      }

    })
    
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    })
  };

  

  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };



  handleSearchClick = ()=>{
    const {form} = this.props
    console.log(form.getFieldsValue())
    this.setState({
      formValues:form.getFieldsValue()
    })
  }

  renderSimpleForm() {
    const { form } = this.props;
    const {experimentType} = this.state
    const {projectType} = this.state
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
                  {experimentType.map((item,index)=>{
                    return <Option key={index} value={index+1}>{item}</Option>
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
    const {dispatch} = this.props
    this.setState({
      selectedRows:[]
    })
    dispatch({
      type:'lab/fetchProjects',
      payload:{
        status:tabActiveKey,
        data:{
          operationType:tabActiveKey==='2'?'0':tabActiveKey,
          operationUnit:4
        }
      }
      
    })
    dispatch({
      type:'lab/changeTabActiveKey',
      payload:tabActiveKey
    })
  };
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
    debugger
    const {dispatch,tabActiveKey} = this.props
    const data = selectedRows.map(item=>{
      return {
        reason:text,
        projectId:item.id
      }
    })
    let payload={
      unit:0,
      data,
      type:approvalType,
      isDetail:true
    }
    console.log(payload)
    dispatch({
      type:'approval/normal',
      payload:{
        unit:0,
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
  // handleReportClick = ()=>{
  //   const {selectedRows,text,approvalType} = this.state
  //   const {dispatch,tabActiveKey} = this.props
  //   const data = selectedRows.map(item=>item.id)
  //   dispatch({
  //     type:'approval/normal',
  //     payload:{
  //       unit:0,
  //       data,
  //       type:2,
  //       isDetail:false,
  //       status:tabActiveKey
  //     }
  //   })

  // }
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
    const {
     
      loading,
      labProjects,
      tabActiveKey
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,approvalType,mVisible,text,formValues } = this.state;
   let projects = labProjects.map((item,index)=>({key:index,...item}))
   const extra  = (
    <div>
      <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel()}>导出立项一览表</Button>
      <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel(1)}>导出项目信息表</Button>
    </div>
    
  );
    const btnDisable = selectedRows.length===0
    const hasSelected = selectedRows.length > 0;
    const { currentPage } = this.state
    return (
      <PageHeaderWrapper
      tabActiveKey={tabActiveKey}
      onTabChange={this.onTabChange}
      extra={extra}
      tabList={[
        // {
        //   key: '0',
        //   tab: '待审批',
        // },
        {
          key: '1',
          tab: '待审批',
        },
        {
          key: '3',
          tab: '已通过',
        },
        {
          key: '2',
          tab: '已驳回',
        }
        
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
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            {tabActiveKey!=='2'&&tabActiveKey!=='3'&&<div className={styles.tableListOperator}>
             
              {tabActiveKey==='1'&&<Button type="primary" disabled={btnDisable} onClick={()=>{this.showApprovalModal(2)}}>
                批准
              </Button>}
              {/* {tabActiveKey==='1'&&<span> 
                <Button disabled={btnDisable} type="primary" onClick={()=>{this.handleReportClick()}}>
                  上报
                </Button>
                <Button disabled={btnDisable} onClick={()=>{}}>
                  修改审批意见
                </Button>
              </span>} */}
              <Button disabled={btnDisable} onClick={()=>this.showApprovalModal(0)}>驳回</Button> 
            </div>}
            <span style={{ marginLeft: 8 }}>
                {hasSelected ? `已选中 ${selectedRows.length} 项` : ''}
              </span>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{pageSize:12}}
            />
          </div>
     
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
