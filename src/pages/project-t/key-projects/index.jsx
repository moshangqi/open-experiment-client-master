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
import {experimentType, statusType,operationType,operationUnit} from '@/utils/constant'
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const {TextArea} = Input
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


/* eslint react/no-multi-comp:0 */
@connect(({ loading,detail,tprojectsKeyProjects }) => ({

  loading: loading.models.tprojects,
  projects:tprojectsKeyProjects.projects,
  process:detail.process
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    mVisible:false,
    approvalType:1,
    text:''
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '实验室',
      dataIndex:'labName',
    },
    {
      title: '项目级别',
      dataIndex:'projectType',
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
      render:(type)=>{
        return type===1?'普通':'重点'
      }
    },
    {
      title: '项目总人数',
      dataIndex:'numberOfTheSelected'
    },
    {
      title: '限选',
      dataIndex: 'fitPeopleNum',
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render:(type)=>{
        return experimentType[type]
        }
      
    },
    {
      title: '状态',
      render:(project) => {
        return <span>
          {statusType[project.status]}
          <a style={{marginLeft:15}} onClick={()=>this.showProcessModal(project.id)}>详情</a>
        </span>;
      },
    },
    // {
    //   title: '计划实验时间',
    //   render: project => <span>{moment(project.startTime).format('YYYY-MM-DD')+'~'+moment(project.endTime).format('YYYY-MM-DD')}</span>,
    // },
    {
      title: '操作',
      dataIndex:'id',
      render: (id) => (
        <Fragment>
          {/* <a onClick={() => this.handleEdit(id)}>编辑</a>
          
          <Divider type="vertical" /> */}
          <a onClick={()=>this.handleDetailClick(id)}>查看详情</a>
        </Fragment>
      ),
    },
  ];
  handleEdit = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:8
      }
    })

  }
  handleDetailClick = (id)=>{
    const {history,dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:5,
        projectType:2
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:5,
        projectType:2
      }
    })
   // history.push('/tproject/manage/detail',id)}
  }
  editWarning = ()=>{
    Modal.warning({
      title: '提醒',
      content: '编辑申请表会导致审核重新开始',
      okText:'知道了',
      onOk:()=>{this.props.history.push('/tproject/manage/edit')}
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'tprojectsKeyProjects/fetch'
    })
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


  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  hideModal = ()=>{
    this.setState({
      modalVisible:false
    })
  }
  showProcessModal = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        role:5,
        projectId:id
      }
    })
    this.setState({
      modalVisible:true
    })
  }
  hideModal = ()=>{
    this.setState({
      mVisible:false,
      modalVisible:false
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
    const {dispatch} = this.props
    const data = selectedRows.map(item=>{
      return {
        reason:text,
        projectId:item.id
      }
    })
    let payload={
      unit:3,
      data,
      type:approvalType,
      isDetail:true
    }
    console.log(payload)
    dispatch({
      type:'approval/key',
      payload:{
        unit:3,
        data,
        type:approvalType,
        isDetail:false
      }
    })
    this.setState({mVisible:false,
    text:''
    })
  }
  handleReportClick = ()=>{
    const {selectedRows,text,approvalType} = this.state
    const {dispatch,tabActiveKey} = this.props
    const data = selectedRows.map(item=>item.id)
    dispatch({
      type:'approval/key',
      payload:{
        unit:3,
        data,
        type:2,
        isDetail:false,
        status:tabActiveKey,
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

  render() {
    const {
      loading,
      projects,
      process
    } = this.props;
    console.log('projects',projects)
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,mVisible,approvalType,text } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const btnDisable = selectedRows.length===0
    console.log(process)
    const timeLines = process.map(item=>{
      switch(item.operationType){
        case '1':
          return <Timeline.Item color="green">
          <p>{`${operationUnit[item.operationUnit]}审核通过  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
        </Timeline.Item>
        case '2':
            return <Timeline.Item color='red'>
            <p>{`${operationUnit[item.operationUnit]}已驳回  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
            <p>驳回原因：{item.reason}</p>
          </Timeline.Item>
        case '3':
            return <Timeline.Item color="green">
            <p>{`${operationUnit[item.operationUnit]}上报  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
          </Timeline.Item>
        case '4':
            return <Timeline.Item>
            <p>{`${operationUnit[item.operationUnit]}修改  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
            {/* <p>备注： {item.reason}</p> */}
          </Timeline.Item>
        default: return ''
      }
    

       
    })
    return (
      <PageHeaderWrapper
      extra={(<Button onClick={this.props.history.goBack}>返回</Button>)}
      >
        <Modal
        visible={mVisible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        title={approvalType===0?'驳回理由':'审核意见'}
        >
          <TextArea onChange={this.handleInputChange} style={{height:150}} value={text} placeholder={approvalType===0?'驳回理由':'审核意见'}/>

        </Modal>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" disabled={btnDisable} onClick={()=>{this.showApprovalModal(1)}}>
                批准
              </Button>
                {/* <Button disabled={btnDisable}  onClick={()=>{}}>
                  修改审批意见
                </Button> */}
              
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal(0)}>驳回</Button> 
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>取消项目</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey="id"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            visible={modalVisible}
            onCancel={this.hideModal}
            footer={''}
            
          >
            {/*01 实验室 23二级单位 45职能部门*/}
            <Timeline>
              {timeLines}
            </Timeline>,

          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
