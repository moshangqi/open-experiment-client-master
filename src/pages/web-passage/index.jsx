import React,{Component} from 'react';
import {Row, Col, Carousel ,Card, Calendar, Button, message} from 'antd';
import styles from './style.less';
import { reqGetOnePassage } from '../settings/web-announcement/server'
import moment from 'moment';
import {Spin} from 'antd';
import {Link} from 'react-router-dom';


const leftCol = {
  xxl: 18,
  xl: 18,
  lg: 18,
  md: 18,
  sm: 24,
  xs: 24
}

const rightCol = {
  xxl: 6,
  xl: 6,
  lg: 6,
  md: 6,
  sm: 24,
  xs: 24
}

const carfLayout = {
  xxl: 12,
  xl: 12,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24
}

const contentStyle = {
  height: '280px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};



class WebPortals extends Component {
  
  state = {
    loading: true
  }

  componentDidMount() {
    const {location} = this.props;
    const { type, id} = location.query;
    reqGetOnePassage({type: type,id: id})
      .then(( {code, data, msg} )=>{
        if(code == 0) {
          this.setState({
            ...data
          })
        } else {
          message.error(msg)
        }
        this.setState({
          loading: false
        })
      })
      .catch((err)=>{
        console.log(err)
      })
    // location.query传递过来的参数
  }

  render(){
    const { realName, title, publishTime, content, projectName, loading} = this.state;
    return(
      <div className={styles.portal}>
        <div className={styles.maxContainer}>
          <header>
            <div className={styles.logBar}>
              <div className={styles.logo}>
                <img src={require('../../assets/logo.png')}/>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles.menu}>
                <Link to='/portal'><li>首&nbsp;&nbsp;&nbsp;&nbsp;页</li></Link>
                <li>学校首页</li>
              </div>
            </div>
          </header>
        </div>
        <Spin spinning={loading}>
          <div className={styles.main}>
            <div className={styles.passage}>
              <div className={styles.header}>
                <div className={styles.title}>{title ? title : projectName ? projectName : ''}</div>
                <div style={{marginTop:'10px'}}>
                  <span className={styles.samllInfo}>发布时间:{moment(parseInt(publishTime)).format('YYYY/MM/DD')}</span>
                  <span className={styles.samllInfo}>发布人:{realName}</span>
                </div>
              </div>
              <div className={styles.passageContent} dangerouslySetInnerHTML = {{__html: `<div class='passage-see'>${content}</div>`}}>
              </div>
            </div>
          </div>
        </Spin>
        <div className={styles.footer}>
          <p>西南石油大学实验室与设备管理处版权所有 2016-2020Tel: FAX:</p>
        </div>
      </div>
    )
  }
}

export default WebPortals