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
import { PageHeaderWrapper,RouteContext } from '@ant-design/pro-layout';
import StandardTable from '@/pages/project-s/manage/projects/components/StandardTable';
import {experimentType,major,college,grade,suggestGroupType, majorCollege} from '@/utils/constant'
import styles from './style.less';
import TextArea from "antd/es/input/TextArea";
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const {Countdown} = Statistic
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');



@connect(({ listTableList, loading,overcollegereturn }) => ({
  listTableList,
  loading: loading.models.overcollegereturn,
  projects:overcollegereturn.projects,
}))



class CollegeReturnProject extends Component {

  state = {
    expandForm: false,
    formValues: {},
    selectedRows: [],
    mVisible:false,
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
      render:(t)=>{
        return t===0?'职能部门':majorCollege[t-1].cName;
      }
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'overcollegereturn/getCollegeReturnProject',
      payload:{
        data:{}
      }
    });
  }

  getProjectId = (e) =>{
    console.log(e);
  };



  handleDetailClick = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:11,
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:11,
      }
    })
  }

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



  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
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
    const {dispatch,tabActiveKey} = this.props
    const data = selectedRows.map(item=>{
      return {
        reason:text,
        projectId:item.id
      }
    })
    let payload={
      data,
    };
    console.log(payload)
    console.log(data)
    if(approvalType === 0){
      dispatch({
        type:'overcollegereturn/CollegeRejectToBeConcludingProject',
        payload:{
          data,
        }
      })
    }
    else if(approvalType === 1){
      dispatch({
        type:'overcollegereturn/CollegeReviewPassed',
        payload:{
          data,
        }
      })
    }

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




  render() {
    const {
      loading,
      projects,
    } = this.props;
    const { selectedRows,mVisible,text,approvalType} = this.state;
    const btnDisable = selectedRows.length===0
    return (
      <PageHeaderWrapper>
        <Modal
          visible={mVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          title={approvalType===0?'不通过理由':'通过理由'}
        >
          <TextArea onChange={this.handleInputChange} style={{height:150}} value={text} placeholder={approvalType===0?'结题复核失败理由':'结题复核同意理由'}/>

        </Modal>
        <Card bordered={false} title='结题驳回项目审理'  style={{marginTop:15}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}></div>
            <div className={styles.tableListOperator}>
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal(1)}>复核通过</Button>
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal(0)}>复核失败</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey='id'
              columns={this.columns}
              pagination={{pageSize:12}}
              onSelectRow={this.handleSelectRows}
            />


          </div>



        </Card>
      </PageHeaderWrapper>

    );
  }
}

export default Form.create()(CollegeReturnProject);
