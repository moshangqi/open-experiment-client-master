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
import styles from './style.less'
import TextArea from "antd/es/input/TextArea";
import Search from "antd/es/input/Search";
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const {Countdown} = Statistic
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({  loading,midKey }) => ({

  loading: loading.models.midKey,
  projects:midKey.projects,
}))
class MidKeyProjectCheck extends Component {
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
        return t===0?'职能部门': (majorCollege.find(item => item.cId == t) || {} ).cName; //majorCollege[t-1].cName;
      }
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render:(type)=>type===1?'普通':'重点'
    },
    // {
    //   title: '已选学生数',
    //   dataIndex: 'numberOfTheSelected',
    // },
    // {
    //   title: '实验类型',
    //   dataIndex: 'experimentType',
    //   render:(type)=>experimentType[type]
    //
    // },
    // {
    //   title: '预申请金额',
    //   dataIndex:'applyFunds',
    //   render:(funds)=> {
    //     return (
    //       <div>
    //         <span>{funds}</span>
    //         {/* <a style={{marginLeft:15}} onClick={this.showModal} href="javasctipt:">修改</a> */}
    //       </div>
    //
    //     );
    //   }
    // },
    // {
    //   title: '计划实验时间',
    //   render: project => <span>{moment(project.startTime).format('YYYY-MM-DD')+'~'+moment(project.endTime).format('YYYY-MM-DD')}</span>,
    // },
    {
      title: '操作',
      dataIndex:'id',
      render: (id) => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>

          <Divider type="vertical" /> */}
          <a onClick={()=>this.handleDetailClick(id)}>查看详情</a>
          <Divider type="vertical" />
          <a onClick={()=>this.stopProject(id)}>中止项目</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'midKey/getIntermediateInspectionKeyProject',
    });
  }

  resetList=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'midKey/getIntermediateInspectionKeyProject',
      payload:{
        data:{}
      }
    });
    this.setState({
      searchValue:''
    })
  };

  stopProject = (id) =>{
    const {dispatch} = this.props;
    let data=

      [
        {projectId:id,
          reason:'中期审核不通过'}
      ]
    ;
    console.log(data);
    dispatch({
      type:'midKey/rejectIntermediateInspectionKeyProject',
      payload:{
        data,
      }
    })
  };

  handleDetailClick = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:8,
        projectType:2
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:8,
        projectType:2
      }
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
    const {selectedRows,text} = this.state
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
    dispatch({
      type:'midKey/KeyProjectMidTermKeyProjectHitBack',
      payload:{
        data,
      }
    })
    this.setState({mVisible:false,
      text:''
    })
  }

  showApprovalModal = (type)=>{
    this.setState({
      mVisible:true
    })
  }
  handleInputChange = (e)=>{
    this.setState({
      text:e.target.value
    })
  }
  handleSearchChange= (e)=>{
    this.setState({
      searchValue:e.target.value
    })
  }

  handleSearch = (value) =>{
    const {dispatch} = this.props;
    let data = {
      keyword:value
    }
    console.log(data);
    dispatch({
      type:'midKey/keyWordSearchKey',
      payload:{
        data,
      }
    })
  }




  render() {
    const {
      loading,
      projects,
    } = this.props;
    const { selectedRows,mVisible,text,searchValue} = this.state;
    const btnDisable = selectedRows.length===0
    return (
      <PageHeaderWrapper>
        <Modal
          visible={mVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          title={'退回理由'}
        >
          <TextArea onChange={this.handleInputChange} style={{height:150}} value={text} placeholder={'退回理由'}/>

        </Modal>
        <Card bordered={false} title='中期项目审理'  style={{marginTop:15}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Search
                placeholder="请输入项目名或编号等查找"
                id={'searchBox'}
                enterButton="Search"
                size="large"
                style={{marginBottom:15}}
                value={searchValue}
                onChange={this.handleSearchChange}
                onSearch={value => this.handleSearch(value)}
              />
            </div>
            <div className={styles.tableListOperator}>
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal()}>退回修改</Button>
              <Button type={"primary"}  onClick={()=>this.resetList()}>重置</Button>
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

export default Form.create()(MidKeyProjectCheck);
