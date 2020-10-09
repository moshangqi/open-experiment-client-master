import React, { Component } from 'react';
import { Card, Button, Upload, Icon, Modal, Form, Input, message, Spin } from 'antd';
import { connect } from 'dva';
import { saveAs } from 'file-saver';
import { applyModel, major as MAJOR, grade as GRADE, majorCollege } from '@/utils/constant';
import baidu from 'baidu-template-pro';

const { TextArea } = Input;
const FormItem = Form.Item;
@connect(({ detail, loading }) => ({
  detail: detail.baseInfo,
  fileList: detail.fileList,
  loading: loading.models.detail,
  budget: detail.budget,
  membersInfo: detail.membersInfo,
}))
class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreview: false,
    };
  }
  togglePreview = () => {
    this.setState({
      isPreview: !this.state.isPreview,
    });
  };
  componentDidMount() {}
  downloadApplyModel = () => {
    const { detail } = this.props;
    saveAs(
      'http://192.168.43.29:8083/document/开放实验重点项目申请书正文参考模板.doc',
      '开放实验重点项目申请书正文参考模板.doc',
    );
  };
  showModal = type => {
    this.setState({
      modalVisible: true,
      isBudget: type === 1,
    });
  };
  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  handleModalOk = () => {
    const { isBudget } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (isBudget) {
        dispatch({
          type: 'detail/saveBudget',
          payload: values,
        });
        message.success('保存经费预算成功');
      } else {
        dispatch({
          type: 'detail/saveMembersInfo',
          payload: values,
        });
        message.success('保存成员简介成功');
      }
    });
    this.setState({
      modalVisible: false,
    });
  };
  render() {
    // const props = {
    //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //   onChange({ file, fileList }) {
    //     if (file.status !== 'uploading') {
    //       console.log(file, fileList);
    //     }
    //   },
    //   fileList: [
    //     {
    //       uid: '1',
    //       name: 'xxx.png',
    //       status: 'done',
    //       response: 'Server Error 500', // custom error message to show
    //       url: 'http://47.107.61.232:8081/sign/100%E9%A2%98%E7%B3%BB%E5%88%97by_July.pdf',
    //     },
    //   ],
    // };
    const { isPreview } = this.state;
    const { detail, fileList, loading, budget = {}, membersInfo = {} } = this.props;
    const students = detail.list.filter(item => item.memberRole !== 1);
    const teachers = detail.list.filter(item => item.memberRole === 1);
    const major = [...new Set(students.map(item => MAJOR[item.major - 1].mName))].join('、');
    const grade = [...new Set(students.map(item => item.grade + '级'))].join('、');
    const data = {
      projectName: detail.projectName,
      projectType: detail.projectType === 1 ? '普通' : '重点',
      applyFunds: detail.applyFunds,
      major,
      grade,
      MAJOR,
      GRADE,
      students,
      teachers,
      belongCollege: detail.subordinateCollege
        ? majorCollege[detail.subordinateCollege - 1].cName
        : '职能部门',
      membersInfo: membersInfo || {},
      budget: budget || {},
    };
    let html = baidu.template(applyModel, data);
    var blob = new Blob([html], { type: 'application/msword' });
    //saveAs(blob,'重点项目申请书.doc')
    console.log(detail.applyurl);
    const props = {
      beforeUpload: file => {
        const { dispatch, budget, membersInfo } = this.props;
        const formData = new FormData();
        const headFile = new File([blob], 'headFile.html', {
          type: 'text/html;charset=utf-8',
          lastModified: Date.now(),
        });
        formData.append('headFile', headFile);
        formData.append('file', file);
        formData.append('projectGroupId', detail.id);
        if (!budget) {
          message.warning('请先填写经费预算');
          return false;
        }
        if (!membersInfo) {
          message.warning('请先填写成员简介');
          return false;
        }
        dispatch({
          type: 'detail/uploadApplyFile',
          payload: {
            data: formData,
            file,
          },
        });
        return false;
      },
      fileList,
    };
    const extra = (
      <div>
        <Button onClick={() => this.showModal(1)}>经费预算</Button>
        <Button onClick={() => this.showModal(2)} style={{ margin: '0 15px ' }}>
          成员简介
        </Button>
        <Button onClick={this.downloadApplyModel} type="primary" icon="download">
          模板下载
        </Button>
      </div>
    );
    const { modalVisible, isBudget } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const Label = ({ children }) => <span>{children}</span>;
    const Judge = detail.projectType === 1 ? 'none' : '';
    return (
      <Spin tip="请耐心等候..." spinning={loading} style={{ display: Judge }}>
        <Card
          title="重点申请正文"
          style={{
            marginBottom: 24,
            display: Judge,
          }}
          extra={extra}
        >
          <Modal
            width={600}
            visible={modalVisible}
            onCancel={this.hideModal}
            onOk={this.handleModalOk}
            title={isBudget ? '经费预算' : '成员简介'}
          >
            <Form>
              {isBudget && (
                <>
                  <FormItem {...formItemLayout} label={<Label>实验材料费</Label>}>
                    {getFieldDecorator('material', {
                      rules: [
                        {
                          required: true,
                          message: '请输入材料费',
                        },
                        {
                          pattern: /\d+/,
                          message: '请输入数字',
                        },
                      ],
                      initialValue: budget.material,
                    })(<Input placeholder="请输入实验材料费" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={<Label>资料、印刷费</Label>}>
                    {getFieldDecorator('print', {
                      rules: [
                        {
                          required: true,
                          message: '请输入资料印刷费',
                        },
                        {
                          pattern: /\d+/,
                          message: '请输入数字',
                        },
                      ],
                      initialValue: budget.print,
                    })(<Input placeholder="请输入资料印刷费" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={<Label>出版费</Label>}>
                    {getFieldDecorator('publish', {
                      rules: [
                        {
                          required: true,
                          message: '请输入出版费',
                        },
                        {
                          pattern: /\d+/,
                          message: '请输入数字',
                        },
                      ],
                      initialValue: budget.publish,
                    })(<Input placeholder="请输入出版费" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={<Label>教师酬金</Label>}>
                    {getFieldDecorator('wages', {
                      rules: [
                        {
                          required: true,
                          message: '请输入教师酬金',
                        },
                        {
                          pattern: /\d+/,
                          message: '请输入数字',
                        },
                      ],
                      initialValue: budget.wages,
                    })(<Input placeholder="请输入教师酬金" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={<Label>其他合理费用</Label>}>
                    {getFieldDecorator('other', {
                      rules: [
                        {
                          required: true,
                          message: '请输入其他合理费用',
                        },
                        {
                          pattern: /\d+/,
                          message: '请输入数字',
                        },
                      ],
                      initialValue: budget.other,
                    })(<Input placeholder="请输入其他合理费用" />)}
                  </FormItem>
                </>
              )}

              {!isBudget && (
                <>
                  <FormItem {...formItemLayout} label={<Label>组长简介</Label>}>
                    {getFieldDecorator('leader', {
                      rules: [
                        {
                          required: true,
                          message: '请输入组长简介',
                        },
                      ],
                      initialValue: membersInfo.leader,
                    })(
                      <TextArea
                        style={{
                          minHeight: 32,
                        }}
                        placeholder="请输入组长简介"
                        rows={4}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={<Label>其他成员简介</Label>}>
                    {getFieldDecorator('members', {
                      rules: [
                        {
                          required: true,
                          message: '请输入其他成员简介',
                        },
                      ],
                      initialValue: membersInfo.members,
                    })(
                      <TextArea
                        style={{
                          minHeight: 32,
                        }}
                        placeholder="请输入其他成员简介"
                        rows={4}
                      />,
                    )}
                  </FormItem>
                </>
              )}
            </Form>
          </Modal>
          <div style={{ width: '50%', float: 'left' }}>
            <Upload
              {...props}
              style={{ width: '200', float: 'left' }}
              showUploadList={{ showRemoveIcon: false }}
            >
              <Button loading={loading}>
                <Icon type="upload" /> {detail.applyUrl ? '重新上传' : '上传'}
              </Button>
            </Upload>
          </div>
          <Button onClick={this.togglePreview}>{isPreview ? '取消预览' : '预览'}</Button>
          <embed
            src={detail.applyUrl}
            style={{ display: isPreview ? 'block' : 'none' }}
            type="application/pdf"
            width="100%"
            height="900px"
          />
        </Card>
      </Spin>
    );
  }
}

export default Form.create()(Preview);
