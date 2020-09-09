import React, { Component } from 'react'
import {Card,Steps} from 'antd'
const {Step} = Steps
function getContentStatus(num) {
  if (num <= 5) {
    return 1;
  } else if (num === 6) {
    return 2;
  } else {
    return 3;
  }
}
const desc1 = (
  <div >
    <div>2016-12-12 12:32</div>
  </div>
);

class Process extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  
  render() {
    const {status=1} = this.props 
    return ( <Card
      title="项目进度"
      style={{
        marginBottom: 24,
      }}
    >
          <Steps
            direction={'horizontal'}
           
            current={getContentStatus(status)}
          >
            <Step title="申请项目" description={desc1} />
            <Step title="立项审核" description={desc1} />
            <Step title="中期检查" />
            <Step title="结题" />
          </Steps>
    </Card> );
  }
}
 
export default Process;