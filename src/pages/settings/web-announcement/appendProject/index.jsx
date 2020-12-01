import React,{Fragment, useRef} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card, Button, Input, message, Modal, Switch,  Upload, Icon, Row, Col, DatePicker, Select, Form} from 'antd';
import { connect } from 'dva';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {reqUploadImage} from '../append/server';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import {debounce} from '../../../../utils/utils';
import moment from 'moment';
import styles from '../append/style.less';
import {suggestGroupType, experimentType, majorCollege} from '../../../../utils/constant';
import {reqGetOnePassage} from '../server';


const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
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
    fileList: this.props.imgUrl ? [{uid: '1',name: '轮播.png',status: 'done',url: this.props.imgUrl}] : []
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
        file.status = 'paper-clip'
      }
      return file;
    });

    this.setState({ fileList: [fileList[fileList.length-1]] });
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
  content: webAppend.content,
  project: webAppend.project
}))
class Append extends React.Component {

  state = {
    imgUrl: this.props.project.imgUrl
  }

  componentDidMount(){
    const { location, dispatch, content } = this.props;
    if(location.query.id) {
      dispatch({
        type: 'webAppend/getProjectDetail',
        payload: {
          type: 3,
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
      type: 'webAppend/changeProject',
      payload: {
        content: data
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
      type: 'webAppend/changeProject',
      payload: {
        projectName: e.target.value
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
    const { content, dispatch, location, form, project } = this.props;
    const {validateFields} = form;

    validateFields( (err,values) => {
      const data = {...values, imgUrl: this.state.imgUrl, projectName: project.projectName, content: project.content }
      data.startDate = data.time[0]._d
      data.endTime = data.time[1]._d
      data.isTop = data.isTop ? 1 : 0
      delete data.time
      dispatch({
      type: 'webAppend/publish',
        payload: {
          type: 3,
          ...data
        }
      })
    })
    // dispatch({
    //   type: 'webAppend/publish',
    //   payload: {
    //     title: content.title,
    //     content: content.detail,
    //     type: location.query.type
    //   }
    // })
  }

  publishSave = () => {
    const {form, dispatch, location, project} = this.props;
    const {validateFields} = form;
    validateFields( (err,values) => {
      const data = {...values, imgUrl: this.state.imgUrl, projectName: project.projectName, content: project.content }
      data.startDate = data.time[0]._d
      data.endTime = data.time[1]._d
      data.isTop = data.isTop ? 1 : 0
      delete data.time
      dispatch({
        type: 'webAppend/publishSave',
        payload: {
          type: 3,
          ...data
        }
      })
    })
    // const { content, dispatch, location } = this.props;
    // dispatch({
    //   type: 'webAppend/publishSave',
    //   payload: {
    //     title: content.title,
    //     content: content.detail,
    //     type: location.query.type,
        
    //   }
    // })
    
  }


  update = () => {
    const { location, dispatch, content, form, project} = this.props;
    const {validateFields} = form;
    validateFields( (err,values) => {
      const data = {...values, imgUrl: this.state.imgUrl, projectName: project.projectName,
         content: project.content,  status: project.status, realName: project.realName}
      data.startDate = data.time[0]._d
      data.endTime = data.time[1]._d
      data.isTop = data.isTop ? 1 : 0
      delete data.time
      delete data.isTop
      dispatch({
      type: 'webAppend/update',
        payload: {
          id: location.query.id,
          type: 3,
          ...data
        }
      })
    })

    // dispatch({
    //   type: 'webAppend/update',
    //   payload: {
    //     id: location.query.id,
    //     type: location.query.type,
    //     content: content.detail,
    //     title: content.title
    //   }
    // })
  }

  render(){
    const { content, location , project, form} = this.props;
    const { getFieldDecorator } = form;
    const type = location.query.type;
    const id = location.query.id;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    
    const title = <Fragment>
      <div>
        <span>标题 :</span>
        <Input placeholder='标题' value={project.projectName} onChange={this.inputChange} style={{width:'80%',marginLeft:15} } />
      </div>
      <Fragment>
        <Form {...formItemLayout}>
          <Row>
            <Col span={8}>
              <FormItem label={'项目类型'}>
                {getFieldDecorator('projectType',{
                  initialValue: String(project.projectType)
                })(
                  <Select>
                    {
                      Object.keys(experimentType).map((item)=>{
                        return <Option key={item}>{experimentType[item]}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'项目分组'}>
                {getFieldDecorator('experimentType',{
                  initialValue: String(project.experimentType)
                })(
                  <Select>
                  {
                    Object.keys(suggestGroupType).map((item)=>{
                    return <Option key={item}>{suggestGroupType[item]}</Option>
                    })
                  }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'所属学院'}>
                {
                  getFieldDecorator('subordinateCollege',{
                    initialValue: project.subordinateCollege
                  })(
                    <Select>
                      {
                        majorCollege.map((item)=>{
                          return <Option key={item.cId}>{item.cName}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            { !id &&
            <Col span={8}>
              <FormItem label={'轮播展示'}>
                {
                  getFieldDecorator('isTop',{
                    initialValue: project.isTop == 1
                  })(
                    <Switch style={{marginRight:"12px"}} defaultChecked={ project.isTop == 1} />
                  )
                }
                <UploadImage imgUrl={project.imgUrl} changeState={this.changeState}/>
              </FormItem>
            </Col>
            }
            <Col span={8}>
              <FormItem  label={'项目周期'}>
                {
                  getFieldDecorator('time',{
                    initialValue: [moment(project.startDate), moment(project.endTime)]
                  })(
                    <RangePicker />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
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
        <Card title={title} className='my-page'>
          {/* <textarea name="content" id="editor" style={{minHeight:'200px'}}>

          </textarea>  */}
           <CKEditor
            // ref = { ref => this.editor = ref}
            editor={ClassicEditor}
            config={initConfig}
            data={project.content}
            onChange={this.save }
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(Append)