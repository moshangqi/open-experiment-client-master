import { Card, Col, Icon, Row, Table, Tooltip,List,Pagination } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { MiniArea } from './Charts';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';
import moment from 'moment';

// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.',
// ];

const TopSearch = ({ loading,data,handleView,title }) => (
 <Card
    loading={loading}
    bordered={false}
    title={title}
    style={{
      height: '100%',
    }}
  >
    <List
      renderItem={item => (
        <List.Item>
          <div style={{width:'100%'}}>
            <Icon style={{marginRight:15}} type='right'></Icon>
            <span onClick={()=>handleView(item.announcementId)} className={styles.announceListSpan}>{item.title}</span>
            <span style={{float:'right'}}>{moment(item.publishTime).format('YYYY-MM-DD')}</span>
          </div>
        </List.Item>
      )}
      dataSource={data}
      pagination={{
        onChange: page => {
          console.log(page);
        },
        size:'small'
        ,
        pageSize: 6,
      }}
    
    >

    </List>
    
  </Card>
);

export default TopSearch;
