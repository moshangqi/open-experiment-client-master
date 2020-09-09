import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  TreeSelect,
  Avatar
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment'
import {majorCollege } from '@/utils/constant'
import { router } from 'umi';
const { Meta } = Card;

@connect(({  loading,getMessage }) => ({
  loading: loading.models.getMessage,
  messages:getMessage.messages,
}))

class MessageTips extends Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'getMessage/getAllMyMessage',
      payload:{
        data:{}
      }
    });
  }

  confirmMes = (id) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'getMessage/confirmReceiptOfMidtermReminder',
      payload:{
        id:id
      }
    });
  };




  render() {

    const {
      loading,
      messages,
    } = this.props;

    const extra = <Button onClick={()=>{router.goBack()}}>返回</Button>;

    let mes = null;
    if (1) {
      mes = (
        <div>
          {
            messages.map((message) => {
              return (
                <Card
                  style={{ marginBottom:15}}
                >
                  <Meta
                    avatar={<Avatar src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3003416489,2049602589&fm=26&gp=0.jpg" />}
                    title={'通知发送人： '+message.sender+' '+'     时间：'+moment(message.sendTime).format('YYYY-MM-DD')}
                    description={'通知详情：\n'+message.content}
                  />
                  {message.isRead ? <Button disabled style={{position:'relative',float:"right"}}>已读</Button> :<Button type={"primary"} style={{position:'relative',float:"right"}} onClick={()=>this.confirmMes(message.id)}>确认</Button>}
                </Card>
              )
            })
          }
        </div>
      )
    }


    return (
      <PageHeaderWrapper content="消息中心" extra={extra}>
          <Card bordered={false}>
            <div loading={loading}>
              {mes}
            </div>
          </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MessageTips);
