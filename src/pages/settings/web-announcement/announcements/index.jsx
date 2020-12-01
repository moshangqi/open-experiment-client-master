import React,{Component, Fragment} from 'react';
import {Card, Button, Dropdown, Form, Row, Col, Select, DatePicker,
  Divider ,Input, Badge, Popconfirm, Switch, Modal} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import StandardTable from './StandardTable';
import moment from 'moment'
import {connect} from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const statusMap = [,'success','processing', 'success', 'error'];
const status = [,'已发布','未发布'];

@connect(({ webAppend }) => ({
  // content: webAppend.content
  type: webAppend.type,
  publishType: webAppend.publishType,
  loading:  webAppend.loading,
  list: webAppend.list
}))
class WebAnnouncement extends Component {

  state = {
    selectedRows: [],
    visible: false
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    // {
    //   title: '发布人',
    //   dataIndex: 'desc',
    // },
    {
      title: '发布日期',
      dataIndex: 'publishTime',
      render: val => {
        return moment(val).format('YYYY-MM-DD HH:mm')
      },
      // mark to display a total number
    },
    
    {
      title: '状态',
      dataIndex: 'status',
      render:(val) => {
        return <span>
          <Badge status={statusMap[val]} text={status[val]} />
        </span>;
      },
    },
    
    {
      title: '操作',
      dataIndex:'id',
      render: (id,record) => { console.log(record);return(
        <Fragment>
          <a onClick={()=>{this.handleWatchPassage(id)}}>查看</a>
           <Divider type="vertical" />
           <a onClick={()=>{this.handlePassageChange(id)}}>修改</a>
           <Divider type="vertical" />
           <a onClick={()=>{this.changeStatus(id, record.status)}}>{record.status == 1 ? '取消发布' : '发布'}</a>
           <Divider type="vertical" />
           <Popconfirm placement="topLeft" title={`确认删除?`} 
            onConfirm={()=>this.handleDelete(id)} okText="确认" cancelText="取消">
              <a style={{color:'red'}}>删除</a>
          </Popconfirm>
           
          
        </Fragment>
      )},
    },
  ];

  columnsProject = [
    {
      title: '项目标题',
      dataIndex: 'projectName',
    },
    // {
    //   title: '发布人',
    //   dataIndex: 'desc',
    // },
    {
      title: '发布日期',
      dataIndex: 'publishTime',
      render: val => {
        return moment(val).format('YYYY-MM-DD HH:mm')
      },
      // mark to display a total number
    },
    {
      title: '状态',
      dataIndex: 'status',
      render:(val) => {
        return <span>
          <Badge status={statusMap[val]} text={status[val]} />
        </span>;
      },
    },
    // {
    //   title: '首页轮播图',
    //   dataIndex: 'imgUrl',
    //   render: (imgUrl) => {
    //     console.log(imgUrl)
    //     return <img style={{width:'100%'}} src={imgUrl}/>
    //   }
    // },
    {
      title: '操作',
      dataIndex:'id',
      render: (id,record) => { return(
        <Fragment>
          <a onClick={()=>{this.handleWatchPassage(id)}}>查看公告</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.handlePassageChange(id)}}>修改</a>
          <Divider type="vertical" />
           <a onClick={()=>{this.changeStatus(id, record.status)}}>{record.status == 1 ? '取消发布' : '发布'}</a>
          <Divider type="vertical" />
          <Popconfirm placement="topLeft" title={`确认删除?`} 
            onConfirm={()=>this.handleDelete(id)} okText="确认" cancelText="取消">
            <a style={{color:'red'}}>删除</a>
          </Popconfirm>
          {record.imgUrl ? <React.Fragment><Divider type="vertical" /><a onClick={
            ()=>{this.setState({visible: true, imgUrl: record.imgUrl})}
          }>
            图片查看</a></React.Fragment> : ''}
          {/* {
            record.isTop && <Fragment>
              <Divider type="vertical" /> <span>轮播展示</span>
            </Fragment>
          } */}
          {/* <Switch defaultChecked={record.isTop? true: false} onChange= {
             ()=>{this.changeShow(id,record.isTop)}
          }  checkedChildren='轮播展示' unCheckedChildren='关闭展示'></Switch> */}
        </Fragment>
      )},
    },
  ];


  componentDidMount(){
    const { dispatch, type } = this.props;
    dispatch({
      type: 'webAppend/fetch',
      payload: {
        type: type
      }
    })
  }

  changeShow = (id, isTop) => {
    console.log(id,isTop)
    const { dispatch } = this.props;
    dispatch({
      type:"webAppend/changeShow",
      payload: {
        id: id
      }
    })
  }

  handleDelete = (id) => {
    const { type, dispatch } = this.props;
    console.log(type,id)
    dispatch({
      type: 'webAppend/delete',
      payload: {
        type: type,
        id: id
      }
    })
  }

  handleAppend = () => {
    if(this.props.type != 3) {
      this.props.history.push(`/settings/web-announcement/append?type=${this.props.type}`)
    }else {
      this.props.history.push('/settings/web-announcement/append-project')
    }
  }

  handlePassageChange = (id) => {
    console.log(id)
    const { type, dispatch } = this.props;
    if(type!=3) {
      this.props.history.push(`/settings/web-announcement/append?type=${this.props.type}&id=${id}`)
    } else {
      this.props.history.push(`/settings/web-announcement/append-project?id=${id}`)
    }
    dispatch({
      type: 'webAppend/getDetail',
      payload: {
        type: type,
        id: id
      }
    })
  }

  handleWatchPassage = (id) => {
    const { history, location, type } = this.props;
    window.location.href =  `http://192.168.109.88/#/passage?id=${id}&type=${type}`
  }

  changeStatus = (id,status) => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'webAppend/changeStatus',
      payload: {
        id,
        type,
        status
      }
    })
  }


  handleTypeChange = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'webAppend/fetch',
      payload: {
        type: e
      }
    })
  }

  handlePublishTypeChange = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'webAppend/fetch',
      payload: {
        publishType: e
      }
    })
  }

  renderForm = () => {
    const { form, type, publishType } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="公告标题">
              {getFieldDecorator('title')(
                <Input placeholder='标题'></Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: publishType
              })(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                  onChange = {this.handlePublishTypeChange}
                >
                  <Option value={'1'}>已发布</Option>
                  <Option value={'0'}>待发布</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('date')(
                <RangePicker
                  style={{
                    width: '100%',
                  }}
                  
                />
              )}
            </FormItem>
          </Col>
          
        </Row>
      </Form>
    );
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
  }


  onTabChange = (tabValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'webAppend/fetch',
      payload: {
        type: tabValue
      }
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  cancle = () => {
    this.setState({
      visible: false
    })
  }

  render(){
    const { type, loading, list } = this.props;
    const { selectedRows, visible, imgUrl } = this.state;
    console.log(list)
    return(
      <PageHeaderWrapper
        tabActiveKey = {type}
        onTabChange = {this.onTabChange}
        tabList = {[ // 门户网站：1公告 2新闻 3展示项目
          {
            key: 1,
            tab: '公告'
          },
          {
            key: 2,
            tab: '新闻'
          },
          {
            key: 3,
            tab: '展示项目'
          }
        ]}>
        <Card>
        <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAppend }>
                {type == 1 ? '新建公告' : type == 2 ? '新建新闻' : '新建展示项目'}
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button type='primary'>发布</Button>
                  <Button>删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            
            {/* <span style={{float:'right'}} className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleFilter}>
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span> */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={list}
              rowKey="id"
              columns={ type == 3 ? this.columnsProject : this.columns}
              pagination={{pageSize:8}}
              onSelectRow={  this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            title='轮播图片'
            visible={visible}
            onCancel = {this.cancle}
            >
            <Card>
              <img src={imgUrl} style={{width:'100%',height:'100%'}}/>
            </Card>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(WebAnnouncement)