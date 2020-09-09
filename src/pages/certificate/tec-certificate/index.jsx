import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import {Button, Card, Tabs, Table, message, Dropdown, Icon, Divider} from "antd";
import CertificateForm from "@/pages/certificate/stu-certificate/CertificateForm";
import {experimentType, memberRole, statusType} from "@/utils/constant";
import moment from "moment";


@connect(({  loading,tecCertificate }) => ({

  loading: loading.models.tecCertificate,
}))

class TecCertificate extends Component {



  handleOpen = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tecCertificate/openApply',
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tecCertificate/closeApply',
    });
  };

  handleDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tecCertificate/emptyTheTable',
    });
  };

  handleDown = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tecCertificate/downloadList',
    });
  };



  render() {
    const extra = <Button onClick={()=>{router.goBack()}}>返回</Button>
    return (
      <PageHeaderWrapper extra={extra}>
            <Card bordered={false} title='证书申领状态管理'  style={{marginTop:15}}>
              <div className={styles.Btnteam}>
              <Button type="primary" shape="round" size={"large"} onClick={()=>this.handleOpen()} className={styles.leftBtn}>
                开启证书申请通道
              </Button>
              <Button type="primary" shape="round" size={"large"} onClick={()=>this.handleClose()}>
                关闭证书申请通道
              </Button>
              </div>

            </Card>

        <Card bordered={false} title='证书申领数据管理'  style={{marginTop:15}}>
            <div className={styles.Btnteam}>
            <Button type="primary" shape="round" size={"large"} onClick={()=>this.handleDelete()} className={styles.leftBtn}>
              清空证书申领数据
            </Button>
            <Button type="primary" shape="round" size={"large"} onClick={()=>this.handleDown()}>
              下载所有申领数据
            </Button>
            </div>
        </Card>
      </PageHeaderWrapper>

    );
  }
}

export default TecCertificate;
