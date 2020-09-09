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
    {
      title:'操作',
      render:(limit)=>{

        return <div>
              <a onClick={()=>this.showAddUpdateModal(limit)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm placement="topLeft" title={`确认删除?`} onConfirm={()=>this.handleDelete(limit.timeLimitType)} okText="确认" cancelText="取消">
                  <a style={{color:'red'}}>删除</a>
              </Popconfirm>
        </div>
         
      }
    }
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
    const title = (
      <Button type='primary' onClick={()=>this.showAddUpdateModal()}>添加时间限制</Button>
    )
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
    <PageHeaderWrapper>
      <Card
        title={title}
      >
        <Modal
        onOk={this.handleModalOk}
        onCancel={this.hideModal}
        title={isUpdate?'修改时间限制':"添加时间限制"}
        visible={mVisible}
        width='450px'
        >
          <Form {...formLayout}>
            {isUpdate?"":<Form.Item label='限制类型'>
              {getFieldDecorator('timeLimitType',{
                rules:[
                  {
                    required:true,
                    message:'请选择限制类型'
                  }
                ],
                initialValue:isUpdate?limit.timeLimitType:undefined
              })(
                <Select placeholder='请选择限制类型'>
                  {Object.keys(collegeTimeLimit).map(item=>{
                  return <Option value={item} key={item}>{collegeTimeLimit[item]}</Option>
                  })}
                </Select>
              )}
            </Form.Item>}
            <Form.Item label='限制时间'>
              {getFieldDecorator('time',{
                rules:[
                  {
                    type: 'array',
                    required:true,
                    message:'请选择限制时间'
                  }
                ],
                initialValue:isUpdate?[moment(limit.startTime),moment(limit.endTime)]:undefined
              })(
                <RangePicker/>
              )}
            </Form.Item>
          </Form>
        </Modal>
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