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
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper,RouteContext } from '@ant-design/pro-layout';
import StandardTable from '@/pages/project-s/manage/projects/components/StandardTable';
import {experimentType,major,college,grade,suggestGroupType, majorCollege} from '@/utils/constant'
import styles from './style.less';
import { DownOutlined } from '@ant-design/icons';
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



@connect(({ listTableList, loading,overkey }) => ({
  listTableList,
  loading: loading.models.overkey,
  projects:overkey.projects,

}))



class OverKeyCheck extends Component {

  state = {
    expandForm: false,
    formValues: {},
    selectedRows: [],
    mVisible:false,
    mVisible2:false,
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
          <Divider type="vertical" />
          <a onClick={()=>this.stopProject(id)}>中止项目</a>
        </Fragment>
      ),
    },
  ];


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'overkey/getCollegeKeyProject',
      payload:{
        data:{}
      }
    });
  }

  resetList=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'mid/getIntermediateInspectionProject',
      payload:{
        data:{}
      }
    });
    this.setState({
      searchValue:''
    })
  };

  getProjectId = (e) =>{
    console.log(e);
  };

  stopProject = (id) =>{
    const {dispatch} = this.props;
    let data=

      [
        {projectId:id,
          reason:'学院结题审核不通过'}
      ]
    ;
    console.log(data);
    dispatch({
      type:'overkey/rejectCollegeKeyProject',
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
        projectType:2,
        role:11,
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        projectType:2,
        role:11,
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




  hideModal = ()=>{
    this.setState({
      mVisible:false
    })
  }

  hideModal2 = ()=>{
    this.setState({
      mVisible2:false
    })
  }
  showModal = ()=>{
    this.setState({
      mVisible:true
    })
  }
  showModal2 = ()=>{
    this.setState({
      mVisible2:true
    })
  }
  handleModalCancel = ()=>{
    this.setState({
      mVisible:false
    })
  }
  handleModalCancel2 = ()=>{
    this.setState({
      mVisible2:false
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
      type:'overkey/hitBackOverKeyProject',
      payload:{
        data,
      }
    })
    this.setState({mVisible:false,
      text:''
    })
  }

  handleModalOk2 = ()=>{
    const {selectedRows,text} = this.state;
    const {dispatch,tabActiveKey,form} = this.props;
    form.validateFields((err,values)=>{
      if(err)
        return;
      const data = selectedRows.map(item=>{
        return {
          value:parseInt(values.value),
          projectId:item.id
        }
      });
      let payload={
        data,
      };
      console.log(payload)
      console.log(data)
      dispatch({
        type:'overkey/ratingOverKeyProject',
        payload:{
          data,
        }
      })

    })
    this.setState({
      mVisible2:false,
    })
  }

  showApprovalModal = (type)=>{
    this.setState({
      mVisible:true
    })
  }

  showApprovalModal2 = (type)=>{
    this.setState({
      mVisible2:true
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
      type:'mid/selectByKeyword',
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
    const { selectedRows,mVisible,mVisible2,text,searchValue} = this.state;
    const btnDisable = selectedRows.length===0;
    const formItemLayout = {
      labelCol: {
        span:5
      },
      wrapperCol: {
        span:18
      },
    };
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props;
    const Label = ({children})=><span>{children}</span>
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

        <Modal
          visible={mVisible2}
          onOk={this.handleModalOk2}
          onCancel={this.handleModalCancel2}
          title={'等级评价'}
        >

          <Form>
            <FormItem {...formItemLayout} label={<Label>评级</Label>}>
              {getFieldDecorator('value', {
                rules: [
                  {
                    required: true,
                    message: '请选择等级',
                  },
                ],
              })(<Select
                placeholder="请选择等级"
              >

                <Option key='0' value='0'>合格</Option>
                <Option key='1' value='1'>一等奖</Option>
                <Option key='2' value='2'>二等奖</Option>
                <Option key='3' value='3'>三等奖</Option>
              </Select>)}
            </FormItem>
          </Form>

        </Modal>



        <Card bordered={false} title='结题项目审理'  style={{marginTop:15}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {/*<Search*/}
              {/*  placeholder="请输入项目名或编号等查找"*/}
              {/*  id={'searchBox'}*/}
              {/*  enterButton="Search"*/}
              {/*  size="large"*/}
              {/*  style={{marginBottom:15}}*/}
              {/*  value={searchValue}*/}
              {/*  onChange={this.handleSearchChange}*/}
              {/*  onSearch={value => this.handleSearch(value)}*/}
              {/*/>*/}
            </div>
            <div className={styles.tableListOperator}>
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal()}>退回修改</Button>
              <Button disabled={btnDisable}  onClick={()=>this.showApprovalModal2()}>学院评级</Button>
              {/*<Button type={"primary"}  onClick={()=>this.resetList()}>重置</Button>*/}
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

export default Form.create()(OverKeyCheck);
