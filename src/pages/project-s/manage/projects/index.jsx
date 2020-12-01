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
  TreeSelect
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Link} from "umi";
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import {projectType,operationUnit, experimentType,statusType, roleNames, memberRole} from '@/utils/constant'
import styles from './style.less';
import Picview from "@/pages/project-s/manage/overproject/components/Picview";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const {TreeNode} = TreeSelect

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['终止', '审核', '立项', '驳回'];

/* eslint react/no-multi-comp:0 */
@connect(({  loading,studentProjects,detail }) => ({

  loading: loading.models.studentProjects,
  projects:studentProjects.projects,
  process:detail.process,
  tabActiveKey:studentProjects.tabActiveKey
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '指导老师',
      dataIndex: 'projectDetails',
      render:(detail)=>{
        return detail.creator.userName
      }
    },
    {
      title: '实验室',
      dataIndex: 'labName',
    },
    {
      title: '项目级别',
      dataIndex: 'projectType',
      render:(type)=>type===1?'普通':'重点'
    },
    {
      title: '项目角色',
      dataIndex:'memberRole',
      render:(role)=>memberRole[role]
    },
    {
      title: '实验类型',
      dataIndex: 'experimentType',
      render:(type)=>experimentType[type]

    },
    {
      title: '状态',
      render:(project) => {
        return statusType[project.status]
        // let val = 0
        // if(project.status>=0&&project.status<=4){
        //   val = 1
        // }else if(project.status>4){
        //   val = 2
        // }else if(project.status===-3){
        //   val = 0
        // }else if(project.status===-2){
        //   val = 3
        // }
        // return <span>
        //   <Badge status={statusMap[val]} text={status[val]} />
        //   <a style={{marginLeft:15}} onClick={()=>this.showProcessModal(project.id)} href="javasctipt:">详情</a>
        // </span>;
      },
    },
    {
      title: '计划实验时间',
      render: project => <span>{moment(project.startTime).format('YYYY-MM-DD')+'~'+moment(project.endTime).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      dataIndex:'id',
      render: (id,record) => (
        <Fragment>
          {/* <a onClick={() => this.editWarning()}>编辑</a>

          <Divider type="vertical" /> */}
          <a onClick={()=>this.handleDetailClick(id,record.projectType)}>查看详情</a>
        </Fragment>
      ),
    },
  ];
  onTabChange = tabActiveKey => {
    const {dispatch} = this.props
    dispatch({
      type:'studentProjects/fetchProjects',
      payload:{
        joinStatus:tabActiveKey
      }
    })
    dispatch({
      type:'studentProjects/changeTabActiveKey',
      payload:tabActiveKey
    })
  };
  componentDidMount() {
    const { dispatch ,tabActiveKey} = this.props;
    dispatch({
      type: 'studentProjects/fetchProjects',
      payload:{
        joinStatus:tabActiveKey
      }
    });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };


  handleSelectRows = rows => {
    console.log(rows)
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
            <FormItem label="开放学院">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">计科院</Option>
                  <Option value="1">电信院</Option>
                  <Option value="2">石工院</Option>
                  <Option value="3">材料院</Option>
                  <Option value="4">艺术院</Option>
                  <Option value="5">化工院</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="适应专业">
              {getFieldDecorator('status')(
                <TreeSelect
                value={this.state.value}
                placeholder="请选择适应专业"
                allowClear
                multiple={true}
                onChange={this.onChange}
              >
                <TreeNode value="0" title="计科院" key="0-1-1" selectable={false}>
                  <TreeNode value="0-1" title="软件工程" key="random"/>
                  <TreeNode value="0-2" title="网络工程" key="random1" />
                  <TreeNode value="0-3" title="物联网工程" key="random2" />
                  <TreeNode value="0-4" title="计算机科学与技术" key="random4" />
                </TreeNode>
                <TreeNode value="1" title="石工院" key="0-1-2" selectable={false}>
                  <TreeNode value="1-1" title="石油工程" key="random5" />
                  <TreeNode value="1-2" title="石油与天然气工程" key="random6" />
                  <TreeNode value="1-3" title="油气储运工程" key="random7" />
                </TreeNode>
              </TreeSelect>
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

  hideModal = ()=>{
    this.setState({
      modalVisible:false
    })
  }
  showModal = ()=>{
    this.setState({
      modalVisible:true
    })
  }
  handleDetailClick = (id,type)=>{
    const {history,dispatch} = this.props
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:7,
        projectType: type
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:7
      }
    })
   // history.push('/tproject/manage/detail',id)}
  }
  showProcessModal = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id
      }
    })
    this.setState({
      modalVisible:true
    })
  }
  handleKeyApply = ()=>{
    const {selectedRows} = this.state
    const {dispatch} = this.props
    console.log(selectedRows)
    if(selectedRows.length>1){
      message.warning('同时只能对一个项目操作')
      return;
    }
    let id = selectedRows[0]?selectedRows[0].id:'0'
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:7,
        projectType:2
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:7,
        projectType:2
      }
    })
  }

  handleOver= ()=>{
    const {selectedRows} = this.state
    const {dispatch} = this.props
    console.log(selectedRows)
    if(selectedRows.length>1){
      message.warning('同时只能对一个项目操作')
      return;
    }
    let id = selectedRows[0]?selectedRows[0].id:'0'
    dispatch({
      type:'detail/fetchDetail',
      payload:{
        projectGroupId:id,
        role:10,
        projectType:2
      }
    })
    dispatch({
      type:'detail/fetchProcess',
      payload:{
        projectId:id,
        role:10,
        projectType:2
      }
    })
  }

  render() {
    const {

      loading,
      projects,
      process,
      tabActiveKey
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const btnDisable = selectedRows.length===0
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">申请终止</Menu.Item>
        <Menu.Item key="approval">申请延期</Menu.Item>
      </Menu>
    );
    const timeLines = process.map((item,index)=>{
      switch(item.operationType){
        case '1':
          return <Timeline.Item key={index} color="green">
          <p>{`${operationUnit[item.operationUnit]}审核通过  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
        </Timeline.Item>
        case '2':
            return <Timeline.Item key={index} color='red'>
            <p>{`${operationUnit[item.operationUnit]}已驳回  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
            <p>驳回原因：{item.reason}</p>
          </Timeline.Item>
        case '3':
            return <Timeline.Item key={index} color="green">
            <p>{`${operationUnit[item.operationUnit]}上报  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
          </Timeline.Item>
        case '4':
            return <Timeline.Item key={index}>
            <p>{`${operationUnit[item.operationUnit]}修改  ${moment(item.operationTime).format('YYYY-MM-DD')}`}</p>
            {/* <p>备注： {item.reason}</p> */}
          </Timeline.Item>
        default: return ''
      }



    })

    return (
      <PageHeaderWrapper
      tabList={[
        {
          key: '2',
          tab: '已通过',
        },
        {
          key: '3',
          tab: '已驳回',
        },
        {
          key: '1',
          tab: '待审批',
        }

      ]}
      onTabChange={this.onTabChange}
      tabActiveKey={tabActiveKey}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            {tabActiveKey ==='2'?<div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.props.history.push('/sproject/join/all')}>
                申请项目
              </Button>
              {selectedRows.length >= 0 && (
                <span>
                  {/* <Button>上传材料</Button> */}
                  {/* <Button>修改申请书</Button> */}
                  <Button disabled={btnDisable} onClick={()=>this.handleKeyApply()}>填写重点项目申请书</Button>
                  <Button disabled={btnDisable} onClick={()=>this.handleOver()}>项目结题申请</Button>
                  <Dropdown disabled overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>:''}
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
            footer={<Button type='primary'>确认修改</Button>}

          >
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
