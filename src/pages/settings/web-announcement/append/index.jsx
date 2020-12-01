import React,{Fragment, useRef} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card, Button, Input, message, Modal, Switch,  Upload, Icon, Row, Col, DatePicker, Select} from 'antd';
import { connect } from 'dva';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {reqUploadImage} from './server';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import {debounce} from '../../../../utils/utils';
import moment from 'moment';
import styles from './style.less';
import {suggestGroupType, experimentType, majorCollege} from '../../../../utils/constant';
import {reqGetOnePassage} from '../server';

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const initConfig = {
  ckfinder:{
    uploadUrl:'/api/file/uploadNewsImages'
  },
  toolbar: ['heading',
    '|','fontsize','fontfamily','fontcolor','highlight','bold','italic','link','bulletedList','numberedList',
    '|','indent','outdent',
    '|','imageUpload','blockQuote','insertTable','mediaEmbed','undo','redo','alignment',
    'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
    '|',
    'imageResize',
    '|',
    'imageTextAlternative'          
  ],
  image: {
    // Configure the available styles.
    styles: [
        'alignLeft', 'alignCenter', 'alignRight'
    ],
    // Configure the available image resize options.
    resizeOptions: [
      {
        name: 'imageResize:original',
        label: 'Original',
        value: null
      },
      {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
      },
      {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
      }
    ],
  },
  language: 'zh-cn'
}


function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}


function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}



const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class UploadImage extends React.Component {

  state = {
    fileList: this.props.imgUrl ? [{uid: '1',name: '轮播.png',status: 'done',url: this.props.imgUrl,}] : []
  }

  handleChange = info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  };

  render() {
    const {changeState} = this.props;
    const props = {
      onChange: this.handleChange,
      multiple: true,
      beforeUpload: (file) => {
        const formData = new FormData();
        formData.append('upload', file)

        this.setState({
          uploading: true,
        });
        reqUploadImage(formData)
          .then((res)=>{
            changeState('imgUrl' ,res.url)
            this.setState({
              uploading: false,
            });
            // res.url 上传后返回的地址
            message.success('上传成功.');
          })
          .catch((e)=>{
            this.setState({
              uploading: false,
            });
            message.error('上传失败');
          })
          return false
      }
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> 上传轮播图
        </Button>
      </Upload>
    );
  }
}

@connect(({ webAppend }) => ({
  content: webAppend.content
}))
class Append extends React.Component {
  
  componentDidMount(){
    const { location, dispatch, content } = this.props;
    if(location.query.id && content.title == '' && content.detail == '') {
      dispatch({
        type: 'webAppend/getDetail',
        payload: {
          type: location.query.type,
          id: location.query.id
        }
      })
    }

  }

  changeState = (name,value) => {
    this.setState({
      [name]: value
    })
  }

  save = (event, editor) => {
    const {dispatch} = this.props;
    const data = editor.getData();
    dispatch({
      type: 'webAppend/changePassage',
      payload: {
        detail: data
      }
    })
  }

  handleChange = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'webAppend/changePassage',
      payload: {
        detail: e
      }
    })
  }

  inputChange = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'webAppend/changePassage',
      payload: {
        title: e.target.value
      }
    })
  }

  handleBack = () => {
    const {location,dispatch} = this.props;
    if(location.query.id) {
      dispatch({
        type: 'webAppend/changeState',
        payload: {
          content: {
            detail: '', 
            title: ''
          }
        }
      })
    }
    this.props.history.goBack(-1);
  }

  publish = () => {
    const { content, dispatch, location } = this.props;
    dispatch({
      type: 'webAppend/publish',
      payload: {
        title: content.title,
        content: content.detail,
        type: location.query.type
      }
    })
  }

  publishSave = () => {
    const { content, dispatch, location } = this.props;
    dispatch({
      type: 'webAppend/publishSave',
      payload: {
        title: content.title,
        content: content.detail,
        type: location.query.type,
        
      }
    })
    
  }


  update = () => {
    const { location, dispatch,content} = this.props;
    dispatch({
      type: 'webAppend/update',
      payload: {
        id: location.query.id,
        type: location.query.type,
        content: content.detail,
        title: content.title
      }
    })
  }

  render(){
    const { content, location ,form} = this.props;
    const type = location.query.type;
    const id = location.query.id;
    const title = <Fragment>
      <div>
        <span>标题 :</span>
        <Input placeholder='标题' value={content.title} onChange={this.inputChange} style={{width:'80%',marginLeft:15} } />
      </div>
      {/* {
        type == 3 &&  <Fragment>
        <Form>
          <Row gutter={4} style={{marginTop:'18px'}}>
            <Col span={6}>
              <span>项目类型 :</span>
              <Select defaultValue={ projectType || experimentType[1]} onChange={e=>{
                this.changeState('projectType',e)
              }} style={{ width: 140, margin: '0 16px'}}>
                {
                  Object.keys(experimentType).map((item, index)=>{
                    return <Option value={item} key={index}>{experimentType[item]}</Option>
                  })
                }
              </Select>
            </Col>
            <Col span={6}>
              <span>项目分组 :</span>
              <Select defaultValue={ experimentTypeTemp || suggestGroupType[1]} onChange={e=>{
                this.changeState('experimentType',e)
              }} style={{ width: 140, margin: '0 16px'}}>
                {
                  Object.keys(suggestGroupType).map((item, index)=>{
                    console.log(experimentTypeTemp,item)
                    return <Option key = {index} value={item}>{suggestGroupType[item]}</Option>
                  })
                }
              </Select>
            </Col>
            <Col span={6}>
              <span>学院 :</span>
              <Select  defaultValue={ subordinateCollege || majorCollege[0]['cName']} onChange={e=>{
                this.changeState('subordinateCollege',e)
              }}  style={{ width: 140, margin: '0 16px'}}>
                {
                  majorCollege.map((item,index)=>{
                    console.log(subordinateCollege || majorCollege[0]['cName'])
                    return <Option key = {index} value={item['cName']}>{item['cName']}</Option>
                    // return <Option value={item}>{suggestGroupType[item]}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row gutter={4} style={{marginTop:'18px'}}>
            <Col span={6}>
                <span>轮播展示 :</span>
                <Switch onChange= {e=>{
                  this.changeState('isTop', e ? 1 : 0)
                }} style={{margin: '0 16px'}} defaultChecked = {isTop ? true : false} checkedChildren='开启' unCheckedChildren='关闭' />
                <UploadImage imgUrl = {imgUrl} changeState={this.changeState}/>
            </Col>
            <Col span={8}>
              <span>项目时间 :</span>
              <RangePicker
                onChange = {e=>{
                  this.setState({
                    startDate: e[0]._d,
                    endTime: e[1]._d
                  })
                }}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment(startDate, 'YYYY-MM-DD'), moment(endTime, 'YYYY-MM-DD')],
                }}
                format="YYYY-MM-DD"
              />
            </Col>
          </Row>
        </Form>
      </Fragment>
      } */}
    </Fragment>
    const exrat = <div>
      {!id && <Fragment>
        <Button className={styles.buttonGroupItem} onClick = {this.publish} type='primary'>发布</Button>
        <Button className={styles.buttonGroupItem} type='primary' onClick={ this.publishSave}>保存</Button>
      </Fragment>}
      {id && <Button  className={styles.buttonGroupItem} onClick={this.update} type='primary'>修改</Button>}
      <Button className={styles.buttonGroupItem} onClick={this.handleBack}>返回</Button>
    </div>
    return(
      <PageHeaderWrapper extra={exrat}>
        <Card title={title}>
          {/* <textarea name="content" id="editor" style={{minHeight:'200px'}}>

          </textarea>  */}
           <CKEditor
            // ref = { ref => this.editor = ref}
            editor={ClassicEditor}
            config={initConfig}
            data={content.detail}
            onChange={this.save }
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Append