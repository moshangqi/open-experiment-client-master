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
  EquipmentList: detail.EquipmentList,
  loading: loading.models.detail,
  budget: detail.budget,
  membersInfo: detail.membersInfo,
}))
class Equipmentview extends Component {
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
    const { isPreview } = this.state;
    const { detail, EquipmentList, loading, budget = {}, membersInfo = {} } = this.props;
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
    const props = {
      beforeUpload: file => {
        const { dispatch, budget, membersInfo } = this.props;
        const formData = new FormData();
        const headFile = new File([blob], 'headFile.html', {
          type: 'text/html;charset=utf-8',
          lastModified: Date.now(),
        });
        //formData.append('headFile',headFile)
        formData.append('file', file);
        formData.append('projectGroupId', detail.id);
        dispatch({
          type: 'detail/uploadExperimentReport',
          payload: {
            data: formData,
            id: detail.id,
            file,
          },
        });
        return false;
      },
      EquipmentList,
    };
    const extra = <div></div>;
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
    return (
      <Spin tip="请耐心等候..." spinning={loading}>
        <Card
          title="项目实验报告"
          style={{
            marginBottom: 24,
          }}
          extra={extra}
        >
          <div style={{ width: '50%', float: 'left' }}>
            <Upload
              {...props}
              style={{ width: '200', float: 'left' }}
              fileList={EquipmentList}
              showUploadList={{ showRemoveIcon: false }}
            >
              <Button loading={loading}>
                <Icon type="upload" /> {detail.equipmenturl ? '重新上传' : '上传'}
              </Button>
            </Upload>
          </div>
          <Button onClick={this.togglePreview}>{isPreview ? '取消预览' : '预览'}</Button>
          <embed
            src={detail.equipmenturl}
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

export default Form.create()(Equipmentview);
