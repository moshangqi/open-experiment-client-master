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
  preTabActiveKey:lab.preTabActiveKey
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    preTabActiveKey:'0',
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
      title:'开放性',
      dataIndex:'isOpenTopic',
      render:(val)=>{
        return openType[val]
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
        role:9
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
  editWarning = ()=>{
    Modal.warning({
      title: '提醒',
      content: '编辑申请表会导致审核重新开始',
      okText:'知道了',
      onOk:()=>{this.props.history.push('/tproject/manage/edit')}
    });
  }
  handleExportExcel = ()=>{
    const {dispatch} = this.props
    dispatch({
      type:'second/export'
    })
  }
  componentDidMount() {
    const { dispatch,preTabActiveKey } = this.props;
    dispatch({
      type:'lab/fetchProjects',
      payload:{
        status:preTabActiveKey,
        data:{
          operationType:preTabActiveKey==='4'?'1':preTabActiveKey,
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

  onTabChange = preTabActiveKey => {
    const {dispatch} = this.props
    this.setState({
      selectedRows:[]
    })
    dispatch({
      type:'lab/fetchProjects',
      payload:{
        status:preTabActiveKey,
        data:{
          operationType:preTabActiveKey==='4'?'1':preTabActiveKey,
          operationUnit:4
        }
      }
      
    })
    dispatch({
      type:'lab/changePreTabActiveKey',
      payload:preTabActiveKey
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
    const {dispatch,preTabActiveKey} = this.props
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
        status:preTabActiveKey,
        data,
        type:approvalType,
        isDetail:false
      }
    })
    this.setState({mVisible:false,
    text:'',
    selectedRows: []
    })
  }
  handleReportClick = ()=>{
    const {selectedRows,text,approvalType} = this.state
    const {dispatch,preTabActiveKey} = this.props
    const data = selectedRows.map(item=>item.id)
    dispatch({
      type:'approval/normal',
      payload:{
        unit:0,
        data,
        type:2,
        isDetail:false,
        status:preTabActiveKey
      }
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
      preTabActiveKey
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,approvalType,mVisible,text,formValues } = this.state;
   let projects = labProjects.filter(item=>{
     return formValues.projectType?item.projectType===formValues.projectType:true
   }).filter(item=>{
    return formValues.experimentType!==undefined?item.experimentType===formValues.experimentType:true
   })
   console.log(selectedRows)
   const hasSelected = selectedRows.length > 0;
   const extra  = (
    <div>
      <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel()}>导出学院上报项目</Button>
      <Button icon='export' type='primary' style={{marginRight:15}} onClick={()=>this.handleExportExcel(1)}>导出学院所有项目信息</Button>
    </div>
    
  );
    const btnDisable = selectedRows.length===0
    return (
      <PageHeaderWrapper
      tabActiveKey={preTabActiveKey}
      onTabChange={this.onTabChange}
      extra={extra}
      tabList={[
        {
          key: '0',
          tab: '待审批',
        },
        {
          key: '4',
          tab: '已通过',
        },
        {
          key: '2',
          tab: '已驳回',
        },
        // {
        //   key: '3',
        //   tab: '已上报',
        // }
        
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
            {preTabActiveKey!=='2'&&preTabActiveKey!=='3'&&<div className={styles.tableListOperator}>
             
              {preTabActiveKey==='0'&&<Button type="primary" disabled={btnDisable} onClick={()=>{this.showApprovalModal(1)}}>
                批准
              </Button>}
              {/* {preTabActiveKey==='1'&&<span> 
                <Button disabled={btnDisable} type="primary" onClick={()=>{this.handleReportClick()}}>
                  上报
                </Button>
                <Button disabled={btnDisable} onClick={()=>{}}>
                  修改审批意见
                </Button>
              </span>} */}
            {preTabActiveKey==='0'&&<Button disabled={btnDisable} onClick={()=>this.showApprovalModal(3)}>驳回</Button>} 
            <span style={{ marginLeft: 8 }}>
                {hasSelected ? `已选中 ${selectedRows.length} 项` : ''}
              </span>
            </div>}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='id'
              pagination={{pageSize:13}}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
