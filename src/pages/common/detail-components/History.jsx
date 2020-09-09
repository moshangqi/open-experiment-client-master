import React, { Component } from 'react'
import {Card,Table} from 'antd'
import {operationUnit,operationType} from '@/utils/constant'
import moment from 'moment'
const columns = [
  {
    title: '操作类型',
    render: ({operationType:type, operationUnit:unit}) => {
      
      return type==='3'&&unit==='4'?'同意':operationType[type];
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
      return moment(time).format('YYYY-MM-DD');
    },
  },
  {
    title: '备注',
    dataIndex: 'reason',
  },
];
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    const {process} = this.props
    return ( <Card  bordered={false} title="操作历史">
    <Table
      pagination={false}
      rowKey={(history,index) =>index }
      dataSource={process}
      columns={columns}
    />
  </Card> );
  }
}
 
export default History;