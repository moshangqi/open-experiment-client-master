import React, {Component, Fragment} from 'react';
import {Card, Button, Upload, Icon, Modal, Form, Input, message, Spin, Table, Select,DatePicker,} from 'antd';
import {AchievementType, funds} from '../../../../../utils/constant'
import {connect} from 'dva'
import {saveAs} from 'file-saver'
import {
  applyModel,
  major as MAJOR,
  grade as GRADE,
  majorCollege,
  memberRole,
  experimentType,
  statusType,
  myMajor
} from '@/utils/constant'
import baidu from 'baidu-template-pro'
import moment from "moment";

const {TextArea} = Input
const { Option } = Select;
const FormItem = Form.Item
@connect(({
            detail,
            loading
          })=>({
  detail:detail.baseInfo,
  OutComeList:detail.baseInfo.listProjectOutcomeVO,
  ZipList:detail.ZipList,
  loading:loading.models.detail,
  budget:detail.budget,
  membersInfo:detail.membersInfo
}))
class OutCome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreview: false
    };
  }

  columns = [
    {
      title: '成果名称',
      dataIndex: 'issuingName',
    },
    {
      title: '成果出处',
      dataIndex: 'provenance',
    },
    {
      title: '成果类型',
      dataIndex: 'value',
      render:e => <span>{AchievementType[e-1]}</span>,
    },
    {
      title: '成果发表授权时间',
      dataIndex:'issuingTime',
      render: e => <span>{moment(e).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      dataIndex:'id',
      render: (id) => (
        <Fragment>
          <a onClick={()=>this.handleDetailClick(id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  handleDetailClick = (id)=>{
    const {detail,dispatch} = this.props;
    let data = {
      id:id
    }
    dispatch({
      type:'detail/deleteIconicResult',
      payload:{
        data,
        theId:detail.id
      }
    })
  }


  componentDidMount(){

  }

  showModal = ()=>{
    this.setState({
      modalVisible:true
    })
  }
  hideModal = ()=>{
    this.setState({
      modalVisible:false
    })
  }
  handleModalOk = ()=>{
    const {dispatch,form} = this.props
    form.validateFields((err,values)=>{
      if(err)
        return;
        let payload = [{

          projectId:values.projectId,
          issuingTime:values.issuingTime.format('YYYY-MM-DD'),
          issuingName:values.issuingName,
          provenance:values.provenance,
          value:parseInt(values.value)

        }]
      dispatch({
        type: 'detail/insertIconicResult',
        payload,
      });
      console.log(payload);

    })
    this.setState({
      modalVisible:false
    })
    form.resetFields();
  }

  deletePic = (uid) =>{
    const {detail,dispatch} = this.props;
    let data = {
      id:uid
    }
    dispatch({
      type:'detail/deleteFile',
      payload:{
        data,
        theId:detail.id
      }
    })
  }
  render() {
    const { isPreview } = this.state;
    const {detail,ZipList,loading,budget={},membersInfo={},OutComeList} = this.props
    const students = detail.list.filter(item=>item.memberRole!==1)
    const teachers = detail.list.filter(item=>item.memberRole===1)
    const major = [...new Set(students.map(item=>(myMajor[item.institute].find( mitem => mitem.mId ==item.major) || {}).mName))].join('、')
    const grade = [...new Set(students.map(item=>item.grade+'级'))].join('、')
    const data = {
      projectName:detail.projectName,
      projectType:detail.projectType===1?'普通':'重点',
      applyFunds:detail.applyFunds,
      major,
      grade,
      MAJOR,
      GRADE,
      students,
      teachers,
      belongCollege:detail.subordinateCollege? (majorCollege.find(item => item.cId ==  detail.subordinateCollege) || {} ).cName //majorCollege[detail.subordinateCollege-1].cName
      :'职能部门',
      membersInfo:membersInfo||{},
      budget:budget||{}
    };

    const props = {
      onRemove: file => {
        this.deletePic(file.uid);
      },
      beforeUpload: file => {
        const {dispatch,budget,membersInfo} = this.props
        const formData = new FormData()
        formData.append('file',file)
        formData.append('projectGroupId',detail.id)
        dispatch({
          type:'detail/uploadAchievementAnnex',
          payload:{
            data:formData,
            id:detail.id,
            file
          }
        })
        return false;
      },
      ZipList,
    };
    const {modalVisible,isBudget} = this.state
    const formItemLayout = {
      labelCol: {
        span:5
      },
      wrapperCol: {
        span:18
      },
    };
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props;
    const Label = ({children})=><span>{children}</span>
    const extra = <div>
      <Button onClick={()=>this.showModal()} type='primary'>新增成果</Button>
    </div>
    const Judge = detail.projectType === 1?'none':'';
    return (

      <Spin tip="请耐心等候..." spinning={loading} style={{display:Judge}}>
        <Card
          title="标志性成果及附件（Zip）"
          style={{
            marginBottom: 24,
            display:Judge
          }}
          extra={extra}
        >
          <Modal
            width={600}
            visible={modalVisible}
            onCancel={this.hideModal}
            onOk={this.handleModalOk}
            title={'新增标志性成果'}
          >

            <Form>
                <FormItem {...formItemLayout} label={<Label>项目ID</Label>} style={{display:"none"}}>
                  {getFieldDecorator('projectId', {
                    rules: [
                      {
                        required: true,
                        message: '项目ID',
                      },
                    ],
                    initialValue:detail.id
                  })(<Input placeholder="请输入项目ID" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={<Label>成果名称</Label>}>
                  {getFieldDecorator('issuingName', {
                    rules: [
                      {
                        required: true,
                        message: '请输入成果名称',
                      },
                    ],
                  })(<Input placeholder="请输入成果名称" />)}
                </FormItem>
              <FormItem {...formItemLayout} label={<Label>成果类型</Label>}>
                {getFieldDecorator('value', {
                  rules: [
                    {
                      required: true,
                      message: '请选择成果类型',
                    },
                  ],
                })(<Select
                  placeholder="请选择预成果类型"
                >
                    <Option key='1' value='1'>发明专利</Option>
                    <Option key='2' value='2'>实用新型专利</Option>
                    <Option key='6' value='3'>论文</Option>
                    <Option key='4' value='4'>竞赛获奖</Option>
                    <Option key='5' value='5'>自研自制设备</Option>
                    <Option key='6' value='6'>其他</Option>
                </Select>)}
              </FormItem>
                <FormItem {...formItemLayout} label={<Label>成果出处</Label>}>
                  {getFieldDecorator('provenance', {
                    rules: [
                      {
                        required: true,
                        message: '请输入成果出处',
                      }
                    ],
                  })(<Input placeholder="请输入成果出处" />)}
                </FormItem>
                <FormItem {...formItemLayout} label={<Label>发表授权时间</Label>}>
                  {getFieldDecorator('issuingTime', {
                    rules: [
                      {
                        required: true,
                        message: '请输入成果发表或授权时间',
                      }
                    ],

                  })(<DatePicker style={{width:'100%'}}/>)}
                </FormItem>
            </Form>
          </Modal>

            <Table
              pagination={false}
              loading={loading}
              dataSource={detail.listProjectOutcomeVO}
              columns={this.columns}
            />

            <br/>


          <div style={{ width: '50%', float: 'left' }}>
            <Upload {...props} style={{ width: '200', float: 'left' }} fileList={ZipList} showUploadList={{showDownloadIcon:false}}>
              <Button loading={loading}>
                <Icon type="upload" /> {detail.zipurl?'重新上传':'上传附件（Zip）'}
            </Button>
            </Upload>
          </div>
        </Card>
      </Spin>
    );
  }
}

export default Form.create()(OutCome);
