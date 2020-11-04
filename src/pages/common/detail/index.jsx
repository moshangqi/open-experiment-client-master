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
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import Achievement from './components/achievement';
import BaseInfo from '../detail-components/BaseInfo';
import styles from './style.less';
import moment from 'moment';
import Advice from '../detail-components/Advice';
import Member from '../detail-components/Member';
import Process from '../detail-components/Process';
import History from '../detail-components/History';
import { json } from 'body-parser';
import { isEmpty } from '@/utils/utils';

import {
  statusType,
  major,
  experimentType,
  suggestGroupType,
  operationType,
  operationUnit,
} from '@/utils/constant';

const { Step } = Steps;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;
const { TextArea } = Input;

const columns = [
  {
    title: '操作类型',
    dataIndex: 'operationType',
    render: type => {
      return operationType[type - 1];
    },
  },
  {
    title: '操作单位',
    dataIndex: 'operationUnit',
    render: unit => {
      return operationUnit[unit];
    },
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    render: time => {
      return moment(time).format('YYYY-MM-DD HH:MM');
    },
  },
  {
    title: '备注',
    dataIndex: 'reason',
  },
];

@connect(({ loading, detail }) => ({
  detail: detail.baseInfo,
  role: detail.role,
  process: detail.process,
  text: '',
  unit: detail.unit,
  reportToAgree: detail.reportToAgree,
}))
class Advanced extends Component {
  state = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
    mVisible: false,
    projectId: '',
    approvalType: 1,
  };

  componentDidMount() {
    const { dispatch, process } = this.props;
    if (isEmpty(this.props.detail)) {
      dispatch({
        type: 'detail/fetchNewDetail',
        payload: JSON.parse(localStorage.getItem('payload-d')),
      });
    }
    if (process.length == 0) {
      dispatch({
        type: 'detail/fetchNewProcess',
        payload: JSON.parse(localStorage.getItem('payload-p')),
      });
    }
  }

  handleModalOk = () => {
    const {
      dispatch,
      role,
      detail: { id },
      unit,
    } = this.props;
    const { approvalType } = this.state;
    console.log(role, approvalType);
    this.setState({
      mVisible: false,
    });
    dispatch({
      type: 'approval/normal',
      payload: {
        unit,
        data: [
          {
            projectId: id,
            reason: this.state.text,
          },
        ],
        type: approvalType,
        isDetail: true,
      },
    });
  };
  handleApprovalClick = type => {
    this.setState({
      mVisible: true,
      approvalType: type,
    });
  };
  handleReportClick = () => {
    const { dispatch, role, detail, unit } = this.props;
    const { approvalType, projectId } = this.state;
    console.log(role, approvalType);
    dispatch({
      type: 'approval/normal',
      payload: {
        unit,
        data: [detail.id],
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
  render() {
    const { operationKey, tabActiveKey, mVisible, projectId, approvalType, text } = this.state;
    const { loading, detail, process = [], unit, reportToAgree } = this.props;
    const { status } = detail;

    const agreeBtnDisable = !(
      (unit === '0' && (status === 0 || status === 1)) ||
      (unit === '1' && status === 2) ||
      (unit === '2' && status === 4) ||
      (unit === '3' && status === -4)
    );
    const rejectBtnDisable = !(
      (unit === '0' && status === 0) ||
      (unit === '1' && status === 2) ||
      (unit === '2' && status === 4) ||
      (unit === '3' && status === -4)
    );
    const reportBtnDisable = !((unit === '0' && status === 1) || (unit === '1' && status === 3));
    console.log(unit, status, agreeBtnDisable);
    const extra = (
      <div className={styles.moreInfo}>
        <Statistic
          style={{ textAlign: 'left' }}
          title="项目状态"
          value={statusType[detail.status]}
        />
        {/* <Statistic title="参与人数" value={detail.stuMembers?detail.stuMembers.length:0}/> */}
      </div>
    );
    const action = (
      <div>
        {['0', '1', '2'].indexOf(unit) >= 0 ? (
          <Button
            disabled={agreeBtnDisable}
            type="primary"
            style={{ marginRight: 15 }}
            onClick={() => this.handleApprovalClick(reportToAgree ? 2 : 1)}
          >
            审批通过
          </Button>
        ) : (
          ''
        )}
        {['1'].indexOf(unit) >= 0 ? (
          <Button
            style={{ marginRight: 15 }}
            disabled={reportBtnDisable}
            onClick={() => this.handleReportClick()}
          >
            上报
          </Button>
        ) : (
          ''
        )}
        {['0', '1', '2'].indexOf(unit) >= 0 ? (
          <Button
            style={{ marginRight: 15 }}
            disabled={reportBtnDisable}
            onClick={() => this.handleApprovalClick(0)}
          >
            驳回
          </Button>
        ) : (
          ''
        )}
        <Button onClick={() => this.props.history.goBack()}>返回</Button>
      </div>
    );
    const tDescriptions = !detail.guideTeachers
      ? ''
      : detail.guideTeachers.map((item, key) => {
          return (
            <div key={key}>
              <Descriptions
                style={{
                  marginBottom: 16,
                }}
              >
                <Descriptions.Item label="姓名">{item.realName}</Descriptions.Item>
                <Descriptions.Item label="电话">{item.mobilePhone}</Descriptions.Item>
                <Descriptions.Item label="QQ">{item.qqNum}</Descriptions.Item>
                <Descriptions.Item label="所属学院">{item.major}</Descriptions.Item>
                <Descriptions.Item label="员工号">{item.code}</Descriptions.Item>
                <Descriptions.Item label="职称">{item.realName}</Descriptions.Item>
              </Descriptions>
              <Divider
                style={{
                  margin: '16px 0',
                }}
              />
            </div>
          );
        });
    const sDecriptions = !detail.stuMembers
      ? ''
      : detail.stuMembers.map((item, key) => {
          return (
            <div key={key}>
              <Descriptions
                style={{
                  marginBottom: 16,
                }}
              >
                <Descriptions.Item label="姓名">{item.realName}</Descriptions.Item>
                <Descriptions.Item label="电话">{item.mobilePhone}</Descriptions.Item>
                <Descriptions.Item label="qq">{item.qqNum}</Descriptions.Item>
                <Descriptions.Item label="所属学院">{item.dept}</Descriptions.Item>
                <Descriptions.Item label="年级">{item.grade}</Descriptions.Item>
              </Descriptions>
              <Divider
                style={{
                  margin: '16px 0',
                }}
              />
            </div>
          );
        });

    return (
      <PageHeaderWrapper
        title={`项目名称：${detail.projectName}`}
        extra={action}
        className={styles.pageHeader}
        content={<BaseInfo detail={detail}></BaseInfo>}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={[
          {
            key: 'detail',
            tab: '详情',
          },
          {
            key: 'achievement',
            tab: '成果',
          },
        ]}
      >
        <Modal
          visible={mVisible}
          title={approvalType === 0 ? '驳回原因' : '审核意见'}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <TextArea
            placeholder={approvalType === 0 ? '驳回理由' : '审核意见'}
            style={{ height: 200 }}
            value={text}
            onChange={this.onTextChange}
          ></TextArea>
        </Modal>
        {tabActiveKey === 'achievement' ? (
          <Achievement />
        ) : (
          <>
            <TabPane key="detail">detail</TabPane>
            <TabPane key="rule">rule</TabPane>

            <div className={styles.main}>
              <GridContent>
                <Card
                  title="项目主要内容"
                  style={{
                    marginBottom: 24,
                  }}
                >
                  {detail.mainContent}
                  {/* <span>服务器数据异常，正在紧急修复中...</span> */}
                </Card>

                <Member memberList={detail.list} />
                <Advice process={process} />

                <History process={process} />
              </GridContent>
            </div>
          </>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Advanced;
