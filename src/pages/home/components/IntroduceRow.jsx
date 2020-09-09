import { Col, Icon, Row, Tooltip,Statistic } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({ loading, visitData }) => (
  <Row gutter={24} type="flex">
   

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="项目申报时间"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        //total={}
        footer={<Field label="距离截止还有" value={'10天'} />}
        contentHeight={46}
      >
        <span style={{fontSize:17}}>{'2017-06-30 ~ 2018-09-23'}</span>
        {/* <MiniArea color="#975FE4" data={visitData} /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="项目审核时间"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
       // total={numeral(6560).format('0,0')}
        footer={<Field label="距离截止还有" value="15天" />}
        contentHeight={46}
      >
        <span style={{fontSize:17}}>{'2017-06-30 ~ 2018-09-23'}</span>
        {/* <MiniBar data={visitData} /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="学生选题时间"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        //total="78%"
        footer={
          <Field label="距离截止还有" value="15天" />
        }
        contentHeight={46}
      >
        <span style={{fontSize:17}}>{'2017-06-30 ~ 2018-09-23'}</span>
        {/* <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="项目申报数/学院限报"
        action={
          <Tooltip title="指标说明">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        // total={() => <span>{numeral(12423).format('0,0')}</span>}
        footer={
          <Field label="计算机科学学院"  />
        }
        contentHeight={46}
      >
        <span style={{float:'left'}}>普通:</span><Statistic style={{float:'left',margin:'0 8px'}} valueStyle={{fontSize:18}} value={156} suffix={`/ 164`} />
        <span style={{float:'left'}}>重点:</span><Statistic style={{float:'left',margin:'0 8px'}} valueStyle={{fontSize:18}} value={159} suffix={`/ 165`} />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
