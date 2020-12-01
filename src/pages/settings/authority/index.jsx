import React, { Component } from 'react'
import {PageHeaderWrapper} from '@ant-design/pro-layout'
import {connect} from 'dva'
import {Card,Table,Button,Modal,Input,Select,Form,Popconfirm}  from 'antd'
import {roleNames} from '@/utils/constant'

const {Option} = Select
@connect(({role})=>({
  roles:role.roles
}))
class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mVisible:false
     }
  }
  componentDidMount(){
    const {dispatch} = this.props
    dispatch({
      type:'role/fetch'
    })
  }
  columns = [

    {
      title:'工号',
      dataIndex:'code'
    },
    {
      title:'姓名',
      dataIndex:'realName'
    },
    {
      title:'电话',
      dataIndex:'mobilePhone'
    },
    {
      title:'email',
      dataIndex:'email'
    },
    {
      title:'角色',
      dataIndex:'role',
      render:(role)=>{
        return roleNames[role]
      }
    },
    {
      title:'操作',
      render:(user)=>{
        return <Popconfirm placement="topLeft" title={`确认删除该角色?`} onConfirm={()=>this.handleDelete(user)} okText="确认" cancelText="取消">
                  <a style={{color:'red'}}>删除</a>
              </Popconfirm>
      }
    }
  ]
  handleDelete = (user)=>{
    const {dispatch} = this.props
    dispatch({
      type:'role/delete',
      payload:{
        roleId:user.role,
        userId:user.code
      }
    })
  }
  handleAddRole = ()=>{
    const {form,dispatch} = this.props
    form.validateFields((err,values)=>{
      dispatch({
        type:'role/add',
        payload:{
          ...values
        }
      })
    })
    this.setState({
      mVisible:false
    })
  }
  showAddModal = ()=>{
    this.setState({
      mVisible:true
    })
  }
  hideModal = ()=>{
    this.setState({
      mVisible:false
    })
  }
  render() {
    const title = (
      <Button type='primary' onClick={this.showAddModal}>添加角色</Button>
    )
    const {getFieldDecorator} = this.props.form
    const {mVisible} = this.state
    const {roles} = this.props
    const formLayout = {
      wrapperCol:{
        span:18
      },
      labelCol:{
        span:4
      }
    }
    return (
    <PageHeaderWrapper>
      <Card
        title={title}
      >
        <Modal
        onOk={this.handleAddRole}
        onCancel={this.hideModal}
        title="添加角色"
        visible={mVisible}
        width='450px'
        >
          <Form {...formLayout}>
            <Form.Item label='用户ID'>
              {getFieldDecorator('userId')(
                <Input placeholder='请输入用户id'></Input>
              )}
            </Form.Item>
            <Form.Item label='角色'>
              {getFieldDecorator('roleId')(
                <Select>
                  <Option value='4'>实验室主任</Option>
                  <Option value='5'>二级单位领导</Option>
                  <Option value='7'>职能部门领导</Option>
                  <Option value='6'>职能部门</Option>

                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Table
        columns={this.columns}
        dataSource={roles}
        rowKey="id"
        />

      </Card>
    </PageHeaderWrapper>
      );
  }
}

export default Form.create()(Authority);
