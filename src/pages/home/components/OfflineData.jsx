import { Card, Col, Row, Tabs } from 'antd';
import React from 'react';
import { TimelineChart, Pie } from './Charts';
import NumberInfo from './NumberInfo';
import TableList from './table-list'
import styles from '../style.less';


const OfflineData = ({ activeKey, loading, offlineData, offlineChartData, handleTabChange }) => (
  <Card
    loading={loading}
    className={styles.offlineCard}
    bordered={false}
    style={{
      marginTop: 32,
    }}
  >
    <TableList></TableList>
    
  </Card>
);

export default OfflineData;
