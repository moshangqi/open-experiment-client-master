import React, { Component } from 'react';
import { Card, Button, Upload, Icon, Modal, Form, Input, message, Spin } from 'antd';
import { connect } from 'dva';

@connect(({ detail, loading }) => ({
  detail: detail.baseInfo,
  PicsList: detail.PicsList,
  loading: loading.models.detail,
  budget: detail.budget,
  membersInfo: detail.membersInfo,
}))
class Picview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PicList: [],
      uploading: false,
      visible: false,
      url: '',
    };
  }

  componentDidMount() {}

  handleUpload = () => {
    const { detail, dispatch } = this.props;
    console.log(detail.id);
    const { PicList } = this.state;
    const list = PicList;
    const formData = new FormData();
    formData.append('projectId', detail.id);
    list.forEach(file => {
      formData.append('file', file);
    });
    dispatch({
      type: 'detail/uploadAttachmentFile',
      payload: {
        data: formData,
        id: detail.id,
      },
    });
    this.setState({
      PicList: [],
    });
  };

  showModal = URL => {
    this.setState({
      visible: true,
      url: URL,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
      url: '',
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      url: '',
    });
  };

  deletePic = uid => {
    const { detail, dispatch } = this.props;
    let data = {
      id: uid,
    };
    dispatch({
      type: 'detail/deleteFile',
      payload: {
        data,
        theId: detail.id,
      },
    });
  };

  render() {
    const { uploading, PicList } = this.state;
    const { detail, loading, budget = {}, membersInfo = {}, PicsList } = this.props;
    const props = {
      multiple: true,
      onPreview: file => {
        this.showModal(file.url);
      },
      onRemove: file => {
        this.deletePic(file.uid);
      },
      beforeUpload: file => {
        this.setState(state => ({
          PicList: [...state.PicList, file],
        }));
        return false;
      },
    };

    return (
      <Spin tip="请耐心等候..." spinning={loading}>
        <Card
          title="附件上传（图片或视频，最大80M）"
          style={{
            marginBottom: 24,
          }}
        >
          <div>
            <Upload {...props} fileList={PicsList} showUploadList={true}>
              <Button>
                <Icon type="upload" /> 选择文件，支持多文件上传
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={PicList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {'上传' + PicList.length + '个文件'}
            </Button>
          </div>

          <Modal
            title="预览"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <embed src={this.state.url} style={{ width: '100%' }} />
          </Modal>
        </Card>
      </Spin>
    );
  }
}

export default Picview;
