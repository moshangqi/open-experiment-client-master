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



@connect(({ listTableList, loading,overkeycollegepass }) => ({
  listTableList,
  loading: loading.models.overkeycollegepass,
  projects:overkeycollegepass.projects,

}))



class WaitOverMarkkeyCollege extends Component {

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
        return t===0?'职能部门': (majorCollege.find(item => item.cId == t) || {} ).cName; // majorCollege[t-1].cName;
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
      type: 'overkeycollegepass/getTheCollegeHasCompletedKeyProject',
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
        projectType:2,
        role:13,
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        projectType:2,
        role:13,
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

        <Card bordered={false} title='学院结题项目总览'  style={{marginTop:15}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>

            </div>
            <div className={styles.tableListOperator}>

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

export default Form.create()(WaitOverMarkkeyCollege);
