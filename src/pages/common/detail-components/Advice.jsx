import React, { Component } from 'react'
import {Descriptions,Card,Empty} from 'antd'
class Adcice extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    const {process} = this.props
    const labOperation = process.find(item=>{
      return item.operationType==="1"&&item.operationUnit==='4'
    })
    const secondOperation = process.find(item=>{
      return item.operationType==='1'&&item.operationUnit==='5'
    })
    const equipOperation = process.find(item=>{
      return item.operationType==='1'&&item.operationUnit==='6'
    })
    return ( 
            <Card

          title="各级部门审核意见"

          style={{
            marginBottom: 24,
          }}
          bordered={false}
          >
            <Descriptions
              title='实验室审核意见'
              column={1}
            >
              <Descriptions.Item>
                {
                  labOperation?labOperation.reason:<Empty/>
                }
              </Descriptions.Item>
            </Descriptions>
            <Descriptions
              title='二级单位审核意见'
              column={1}
            >
              <Descriptions.Item>
              {
                  secondOperation?secondOperation.reason:<Empty/>
                }     
              </Descriptions.Item>
              
            </Descriptions>
            <Descriptions
              title='职能部门审核意见'
              column={1}
            >
              <Descriptions.Item>
              {
                  equipOperation?equipOperation.reason:<Empty/>
                }     
              </Descriptions.Item>
            </Descriptions>

    </Card>
     );
  }
}
 
export default Adcice;