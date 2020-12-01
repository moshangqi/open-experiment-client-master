import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
  Tabs,
  Modal,
  Input,
  Upload,
  message, Form, Select,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import Achievement from '../../../common/key-detail/components/achievement';
import styles from '../../../common/key-detail/style.less';
import moment from 'moment';
import { json } from 'body-parser';
import BaseInfo from '../../../common/detail-components/BaseInfo';
import Advice from '../../../common/detail-components/Advice';
import Member from '../../../common/detail-components/Member';
import Process from '../../../common/detail-components/Process'
import { statusType, operationType, operationUnit, suggestGroupType } from '@/utils/constant';
import Preview from '../../../common/detail-components/Preview';
import History from '../../../common/detail-components/History'
import Fileview from "@/pages/project-s/manage/overproject/components/Fileview";
import Picview from "./components/Picview";
import Equipmentview from "./components/Equipmentview";
import OutCome from "./components/OutCome";
import { isEmpty } from '@/utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

function getHeaderStatus(num) {
  if (num === -2) {
    return '已驳回';
  } else if (num === -3) {
    return '已终止';
  } else if (num >= 0 && num <= 5) {
    return '立项审核中';
  } else if (num === 6) {
    return '中期检查';
  }
  else {
    return '项目结题';
  }
}

@connect(({ detail,loading }) => ({
  loading:loading.models.detail,
  detail: detail.baseInfo,
  role: detail.role,
  process: detail.process,
  text: '',
  unit:detail.unit
}))
class OverProject extends Component {
  state = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
    mVisible: false,
    projectId: '',
    approvalType: 1,
    isPreview: false,
  };

  componentWillMount(){
    if(!isEmpty(this.props.detail)){
      return
    }
    const {dispatch} = this.props;
    dispatch({
      type:'detail/fetchNewDetail',
      payload: JSON.parse(localStorage.getItem('payload-d'))
    })
    dispatch({
      type:'detail/fetchNewProcess',
      payload: JSON.parse(localStorage.getItem('payload-p'))
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(window.localStorage.getItem('antd-pro-authority')[1]);
  }
  handleModalOk = () => {

    const {dispatch,form,detail} = this.props;
    form.validateFields((err,values)=>{
      if(err)
        return;
      const data =
        [{
          value:parseInt(values.value),
          projectId:detail.id
        }]
      ;
      let payload={
        data,
      };
      console.log(payload)
      console.log(data)
      if(window.localStorage.getItem('antd-pro-authority')[1] == 9 && detail.projectType == 1) {
        dispatch({
          type: 'over/CollegeGivesRating',
          payload: {
            data,
          }
        })
      }
      else if(window.localStorage.getItem('antd-pro-authority')[1] == 9 && detail.projectType == 2){
        dispatch({
          type: 'overkey/ratingOverKeyProject',
          payload: {
            data,
          }
        })
      }
      else if(window.localStorage.getItem('antd-pro-authority')[1] == 6 && detail.projectType == 1){
        dispatch({
          type: 'overfunction/FunctionGivesRating',
          payload: {
            data,
          }
        })
      }
      else if(window.localStorage.getItem('antd-pro-authority')[1] == 6 && detail.projectType == 2){
        dispatch({
          type: 'overkeyfunction/functionGivesKeyProjectRating',
          payload: {
            data,
          }
        })
      }
    })
    this.setState({
      mVisible:false,
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
  showApprovalModal = (type)=>{
    this.setState({
      mVisible:true
    })
  }
  handleApprovalClick = type => {
    this.setState({
      mVisible: true,
      approvalType: type,
    });
  };
  handleReportClick = () => {
    const { dispatch, role, detail,unit } = this.props;
    const { approvalType, projectId } = this.state;
    console.log(role, approvalType);
    dispatch({
      type: 'approval/key',
      payload: {
        unit,
        data: [detail.projectGroupId],
        type: 2,
        isDetail: true,
      },
    });
  };
  handleModalCancel = () => {
    this.setState({
      mVisible: false,
    });
  };

  onOperationTabChange = key => {
    this.setState({
      operationKey: key,
    });
  };

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  onTextChange = e => {
    this.setState({
      text: e.target.value,
    });
  };
  handleKeyProjectApply = () => {
    const { dispatch, detail } = this.props;

    dispatch({
      type: 'approval/apply',
      payload: {
        projectId: detail.id,
      },
    });
  };


  render() {
    const {
      operationKey,
      tabActiveKey,
      mVisible,
      projectId,
      approvalType,
      text,
      isPreview,
    } = this.state;
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
    const {  loading, detail, process,unit } = this.props;
    const {status} = detail
    const agreeBtnDisable = !(unit==='0'&&status===0||unit==='1'&&status===2||unit==='2'&&status===4||unit==='3'&&status===-4)
    const rejectBtnDisable = !(unit==='0'&&status===0||unit==='1'&&status===2||unit==='2'&&status===4||unit==='3'&&status===-4)
    const reportBtnDisable = !(unit==='0'&&status===1||unit==='1'&&status===3 )
    const keyApplyBtnDisable = detail.status!==1&&detail.status!==-2
    const Judge = window.localStorage.getItem('antd-pro-authority')[1] == 9?'':'none';
    const JudgeFunction = window.localStorage.getItem('antd-pro-authority')[1] == 6?'':'none';

    console.log(detail);
    const extra = (
      <div className={styles.moreInfo}>
        <Statistic style={{ textAlign: 'left', marginRight: 30 }} title="重点申请书状态" valueStyle={{fontSize:19}} value={detail.whetherCommitKeyApply?'已提交':'未提交'} />
        <Statistic style={{ textAlign: 'left' }} title="项目状态" valueStyle={{fontSize:19}} value={statusType[detail.status]} />
        {/* <Statistic title="参与人数" value={detail.stuMembers ? detail.stuMembers.length : 0} /> */}
      </div>
    );
    const action = (
      <div>
        {unit==='4'?<Button
          type="primary"
          style={{ marginRight: 15 }}
          onClick={() => this.handleKeyProjectApply()}
          disabled={keyApplyBtnDisable}
        >
          提交重点申请
        </Button>:''}
        {['0','1','2','3'].indexOf(unit)>=0?<Button
          type="primary"
          style={{ marginRight: 15 }}
          onClick={() => this.handleApprovalClick(1)}
          disabled={agreeBtnDisable}
        >
          审批通过
        </Button>:''}
        {['1'].indexOf(unit)>=0?<Button style={{ marginRight: 15 }} disabled={reportBtnDisable} onClick={() => this.handleReportClick()}>
          上报
        </Button>:''}
        {['0','1','2','3'].indexOf(unit)>=0?<Button style={{ marginRight: 15 }} disabled={rejectBtnDisable} onClick={() => this.handleApprovalClick(0)}>
          驳回
        </Button>:''}
        <Button style={{ marginRight: 15,display:Judge }}  onClick={()=>this.showApprovalModal()} type="primary">等级评价</Button>
        <Button style={{ marginRight: 15,display:JudgeFunction }}  onClick={()=>this.showApprovalModal()} type="primary">等级评价</Button>
        <Button onClick={() => this.props.history.goBack()}>返回</Button>
      </div>
    );
    console.log(process);






    return (
      <PageHeaderWrapper
        title={`项目名称：${detail.projectName}`}
        extra={action}
        className={styles.pageHeader}
        content={<BaseInfo detail={detail}></BaseInfo>}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <Modal
          visible={mVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          title={'等级评价'}
        >

          {detail.projectType === 1?
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
                  <Option key='1' value='1'>优秀</Option>
                  <Option key='0' value='0'>通过</Option>
                </Select>)}
              </FormItem>
            </Form>
            :
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
          }

            </Modal>


          <>
            <TabPane key="detail">detail</TabPane>
            <TabPane key="rule">rule</TabPane>

            <div className={styles.main}>
              <GridContent>
                {/* <Process/> */}
                <Card
                  title="项目主要内容"
                  style={{
                    marginBottom: 24,
                  }}
                >
                  {detail.mainContent}
                  {/* <span>服务器数据异常，正在紧急修复中...</span> */}

                </Card>
                {isEmpty(detail)?<></>:<Preview/>}
                {isEmpty(detail)?<></>:<Fileview fileUrl={detail.overurl}/>}
                {isEmpty(detail)?<></>:<Equipmentview/>}
                <Picview />
                {isEmpty(detail)?<></>:<OutCome />}
                <Member memberList={detail.list} />
                <Advice process={process} />
                <History process={process}/>
              </GridContent>
            </div>
          </>

      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(OverProject);
