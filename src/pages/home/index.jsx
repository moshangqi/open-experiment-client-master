import { Col, Dropdown, Icon, Menu, Row } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import OpenProjects from '../common/OpenProjects'
import styles from './style.less';
// import Projects from '@/pages/account/center/components/Projects';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const Announcement = React.lazy(() => import('./components/Announcement'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
// const OfflineData = React.lazy(() => import('./components/OfflineData'));
const salePieData = [
  {
    x:'科研',
    y:136
  },
  {
    x:'科技活动',
    y:87
  },
  {
    x:'自选课题',
    y:99
  },
  {
    x:'计算机应用',
    y:198
  },
  {
    x:'人文素质',
    y:66
  },
]
@connect(({ dashboardAnalysis, loading ,openProjects,announcement}) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetch'],
  projects:openProjects.projects,
  announcements:announcement.data
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  reqRef = 0;

  timeoutId = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
    dispatch({
      type: 'openProjects/fetchProjects',
    });
    dispatch({
      type:'announcement/fetch'
    })
    dispatch({
      type:'openProjects/getMessageTips'
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'dashboardAnalysis/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    dispatch({
      type: 'dashboardAnalysis/fetchSalesData',
    });
  };
  handleView = (id)=>{
    console.log(id)
    const {dispatch} = this.props
    dispatch({
      type:'announcement/getDetail',
      payload:{
        announcementId:id
      }
    })
    this.props.history.push('/announcement/detail')

  }
  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { dashboardAnalysis, loading ,projects,announcements} = this.props;
    console.log(projects)
    // const {


    //   searchData,
    //   offlineData,
    //   offlineChartData,
    //   salesTypeData,
    //   salesTypeDataOnline,
    //   salesTypeDataOffline,

    // } = dashboardAnalysis;
    // let salesPieData;
    let announcementsData = announcements.filter(item=>{
      return item.status === 1
    }).sort((a,b)=>{
      return b.publishTime - a.publishTime
    })
    // if (salesType === 'all') {
    //   salesPieData = salesTypeData;
    // } else {
    //   salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    // }

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );
    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );
    // const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>

          {/* <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading}  />
          </Suspense> */}
          <Suspense fallback={null}>
            {/* <SalesCard
              rangePickerValue={rangePickerValue}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
            /> */}
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Announcement
                  loading={loading}
                  data={announcementsData}
                  title='所有公告'
                  handleView={this.handleView}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
              <Announcement
                  loading={loading}
                  data={announcementsData}
                  title='院内公告'
                  handleView={this.handleView}
                />
                {/* <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salePieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                /> */}
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            {/* <OfflineData

              loading={loading}
            /> */}
            <OpenProjects/>
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
