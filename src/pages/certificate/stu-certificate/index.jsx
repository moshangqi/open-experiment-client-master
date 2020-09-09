import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { router } from 'umi';
import {Button, Card, Tabs, Table, message, Dropdown, Icon, Divider} from "antd";
import CertificateForm from "@/pages/certificate/stu-certificate/CertificateForm";
import {experimentType, memberRole, statusType} from "@/utils/constant";
import moment from "moment";
import StandardTable from "@/pages/project-s/manage/projects/components/StandardTable";


const { TabPane } = Tabs;

@connect(({  resCertific,loading }) => ({

  loading: loading.models.resCertific,
  projects:resCertific.projects,
}))

class StuCertificate extends Component {

  state = {
    selectedRows: [],
  };

  callback=key=> {
    console.log(key);
  }

  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resCertific/viewMyApplication'
    });
  }

  makeArr = e =>{
    let i;
    let a = [];
    for(i=0;i<e.length;i++){
         a.push({'id':e[i].id});
    }
    return a ;
  };

  // handleKeyApply = ()=>{
  //   const {selectedRows} = this.state;
  //   const {dispatch} = this.props;
  //   let id = this.makeArr(selectedRows);
  //   console.log(id);
  //   dispatch({
  //     type:'resCertific/deleteMyApplication',
  //     payload:{
  //       deleteCertificate :id
  //     }
  //   })
  // };

  handleDelete = (id) =>{
    const {dispatch} = this.props;
    console.log(id);
    dispatch({
      type:'resCertific/deleteMyApplication',
      payload:{
        id:id
      }
    });
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '立项编号',
      dataIndex: 'serialNumber',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
    },
    {
      title: '成员身份',
      dataIndex:'memberRole',
    },
    {
      title: '项目所属学院',
      dataIndex: 'subordinateCollage',
    },
    {
      title: '取消申请',
      dataIndex:'id',
      render: (id) => (

        <Button onClick={()=>this.handleDelete(id)} type="primary">取消申请</Button>
      )

    },
  ];


  render() {
    const extra = <Button onClick={()=>{router.goBack()}}>返回</Button>
    const {
      projects,
      loading
    } = this.props;
    const { selectedRows } = this.state;
    const btnDisable = selectedRows.length===0
    return (
      <PageHeaderWrapper extra={extra}>

        <Tabs defaultActiveKey="2" onChange={this.callback} tabBarStyle={{marginTop:-15}}>
          <TabPane tab="申请表单" key="1">
          <Card bordered={false} title='证书申领信息表'  style={{marginTop:15}}>
              <CertificateForm/>
          </Card>
          </TabPane>
          <TabPane tab="已申请" key="2">
            <Card bordered={false} title='已申请列表'  style={{marginTop:15}}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={projects}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              columns={this.columns}
              style={{marginTop:10}}
            />
            </Card>
          </TabPane>
        </Tabs>

      </PageHeaderWrapper>

    );
  }
}

export default StuCertificate;
