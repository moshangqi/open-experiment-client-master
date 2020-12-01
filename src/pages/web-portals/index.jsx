import React,{Component} from 'react';
import {Row, Col, Carousel ,Card, Calendar, Button} from 'antd';
import CardList from './components/CardList'
import MyTable from './components/mytable'
import styles from './style.less';
import {connect} from 'dva'

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
  // height: '280px',
  width: '100%',
  color: '#fff',
  lineHeight: '160px',
  // height: '300px'
  textAlign: 'center',
  margin: '0 auto',
  // position: "absolute",
};


@connect(({ home }) => ({
  achievementShowList: home.achievementShowList,
  newsList: home.newsList,
  achievementList: home.achievementList,
  announcementList: home.announcementList,
}))
class WebPortals extends Component {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchShowList',
    })
    dispatch({
      type: 'home/fetchAnnouncement'
    })
    dispatch({
      type: 'home/fetchAchievementList'
    })
    dispatch({
      type: 'home/fetchNewsList'
    })
  }

  toLogin = () => {
    const {history, location} = this.props;
    history.push({
      pathname: '/user/login'
    })
  }

  getPassage = ( id , type ) => {
    const {history} = this.props;
    history.push(`/passage?id=${id}&type=${type}`)
  }

  render(){
    // console.log(this.props)
    const { achievementShowList, newsList, announcementList, achievementList } = this.props;
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
                <li>首&nbsp;&nbsp;&nbsp;&nbsp;页</li>
                <li>学校首页</li>
              </div>
            </div>
          </header>
          <div className={styles.main}>
            <Row>
              <Col {...leftCol}>
                <div className={styles.myPadding} style={{overflow:'hidden',marginBottom:'20px',position:"relative"}}>
                  <Carousel ref = { ref => this.lunbo = ref}>
                    {
                      achievementShowList.map((item)=>{
                        return <div key={item.id} className='lunbo' onClick= {()=>{this.lunbo.next();}}>
                          <img onClick={()=>{this.getPassage(item.id,3)}} style={contentStyle} src = {item.imgUrl} />
                        </div>
                      })
                    }
                  </Carousel>
                </div>
                <Row className={`${styles.myPadding} ${styles.content}`} >
                  <Col {...carfLayout} className={styles.cards}>
                    <Card title={<div>通知公告</div>} style={{height:'384px'}}>
                      <CardList type='1' list = {announcementList} />
                      {/* <p style={{height:'1000px'}}>hahahahah</p> */}
                    </Card>
                  </Col>
                  <Col {...carfLayout}>
                    <Card title={<div>新闻动态</div>} style={{height:'384px'}}>
                      <CardList type='2' list = {newsList}/>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col {...rightCol}>
                <div style={{border:'1px solid #e8e8e8'}}>
                  <Calendar fullscreen={false} />
                </div>
                <Card title='用户登录' className={styles.topBottom}>
                  <Button style={{width:"100%"}} className={styles.topBottom} onClick={this.toLogin}>学生入口</Button>
                  <Button style={{width:"100%"}} onClick={this.toLogin}>老师入口</Button>
                </Card>
              </Col>
            </Row>

            <div>
              <Card className={styles.topBottom} title={<div>成果展示</div>}>
                <MyTable list = {achievementList}/>
              </Card>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <p>西南石油大学实验室与设备管理处版权所有 2016-2020Tel: FAX:</p>
        </div>
      </div>
    )
  }
}

export default WebPortals