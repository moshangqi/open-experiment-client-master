import React, { Component } from 'react'
import {PageHeaderWrapper} from '@ant-design/pro-layout'
import {connect} from 'dva'
import {Card,Table,Button,Modal,Input,Select,Form,Popconfirm,Divider,DatePicker}  from 'antd'
import {roleNames,collegeTimeLimit} from '@/utils/constant'
import moment from 'moment'

const {Option} = Select
const {RangePicker} = DatePicker
@connect(({secondSetting,user,global})=>({
  timeLimits:secondSetting.timeLimits,
  user:user.currentUser,
  amountLimit:global.amountLimit
}))
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      mVisible:false,
      isUpdate:false,
      limit:{}
     }
  }
  componentDidMount(){
    const {dispatch,user:{institute}} = this.props
    dispatch({
      type:'secondSetting/fetch'
    })
   
  }
  columns = [
    {
      title:'限制类型',
      dataIndex:'timeLimitType',
      render:(type)=>{
        return collegeTimeLimit[type]
      }
    },
    {
      title:'开始时间',
      dataIndex:'startTime',
      render:(time)=>{
        return moment(time).format('YYYY-MM-DD')
      }
    },
    {
      title:'结束时间',
      dataIndex:'endTime',
      render:(time)=>{
        return moment(time).format('YYYY-MM-DD')
      }
    },
  ]
  handleDelete = (type)=>{
    const {dispatch} = this.props
    dispatch({
      type:'secondSetting/delete',
      payload:{
        type
      }
    })
  }
  handleModalOk = ()=>{
    const {form,dispatch,user:{institute}} = this.props
    const {isUpdate,limit} = this.state
    form.validateFields((err,values,rr)=>{
      console.log(err)
      if(!err){
        const startTime = values.time[0].format('x')
        const endTime = values.time[1].format('x')
        if(isUpdate){
          const {timeLimitType} = limit
          dispatch({
            type:'secondSetting/update',
            payload:{
              startTime,
              endTime,
              timeLimitType,
              college:institute
            }
          })
        }else{
          const {timeLimitType} = values
          dispatch({
            type:'secondSetting/add',
            payload:{
              startTime,
              endTime,
              timeLimitType,
              college:institute
            }
          })
        }
        this.setState({
          mVisible:false
        })
        form.resetFields()
      }else{
        return err
      }
    })
    
  }
  showAddUpdateModal = (limit)=>{
    this.setState({
      mVisible:true,
      isUpdate:!!limit,
      limit:limit||{}
    })
  }
  hideModal = ()=>{
    const {form} = this.props
    this.setState({
      mVisible:false
    })
    form.resetFields()
  }
  render() { 
    
    const {getFieldDecorator} = this.props.form
    const {mVisible,limit,isUpdate} = this.state 
    const {timeLimits} = this.props
    const formLayout = {
      wrapperCol:{
        span:18
      },
      labelCol:{
        span:5
      }
    }
    return ( 
    <PageHeaderWrapper extra={<Button onClick={()=>this.props.history.goBack()}>返回</Button>}>
      <Card
       
      >
        
        <Table
        columns={this.columns}
        dataSource={timeLimits}
        rowKey="id"
        />

      </Card>
    </PageHeaderWrapper>
      );
  }
}
 
export default Form.create()(Settings);