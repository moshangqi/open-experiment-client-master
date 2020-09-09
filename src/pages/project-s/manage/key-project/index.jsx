import {
  Badge,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popover,
  Steps,
  Table,
  Tooltip,
  Empty,
  Tabs
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import Achievement from './components/achievement'
import styles from './style.less';

const { Step } = Steps;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;
const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);
const mobileMenu = (
  <Menu>
    <Menu.Item key="1">操作一</Menu.Item>
    <Menu.Item key="2">操作二</Menu.Item>
    <Menu.Item key="3">选项一</Menu.Item>
    <Menu.Item key="4">选项二</Menu.Item>
    <Menu.Item key="">选项三</Menu.Item>
  </Menu>
);
// const action = (
//   <RouteContext.Consumer>
//     {({ isMobile }) => {
//       if (isMobile) {
//         return (
//           <Dropdown.Button
//             type="primary"
//             icon={<Icon type="down" />}
//             overlay={mobileMenu}
//             placement="bottomRight"
//           >
//             主操作
//           </Dropdown.Button>
//         );
//       }

//       return (
//         <Fragment>
//           <ButtonGroup>
//             <Button>操作一</Button>
//             <Button>操作二</Button>
//             <Dropdown overlay={menu} placement="bottomRight">
//               <Button>
//                 <Icon type="ellipsis" />
//               </Button>
//             </Dropdown>
//           </ButtonGroup>
//           <Button type="primary">主操作</Button>
//         </Fragment>
//       );
//     }}
//   </RouteContext.Consumer>
// );
const extra = (
      <span>
        <span>状态 : </span>
        <Badge status='processing'></Badge>
        <span >未提交</span>
      </span>
);
const description = (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="创建人">XX老师</Descriptions.Item>
        <Descriptions.Item label="开放实验室">明理楼XX实验室</Descriptions.Item>
        <Descriptions.Item label="地点">石油大学XX教师</Descriptions.Item>
        <Descriptions.Item label="实验类型">
          科技活动
        </Descriptions.Item>
        <Descriptions.Item label="实验时间">2017-07-07 ~ 2017-08-08</Descriptions.Item>
        <Descriptions.Item label="项目级别">重点</Descriptions.Item>
        <Descriptions.Item label="建议审分组">E组-软件与数学</Descriptions.Item>
        <Descriptions.Item label="适应专业">软件工程、网络工程</Descriptions.Item>
        <Descriptions.Item label="适宜学生数">10</Descriptions.Item>
        <Descriptions.Item label="成果及考核方式">项目审查</Descriptions.Item>
        <Descriptions.Item label="计划实验小时">153</Descriptions.Item>
        <Descriptions.Item label="开放实验条件">无条件</Descriptions.Item>
       
      </Descriptions>
    )}
  </RouteContext.Consumer>
);
const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      曲丽丽
      <Icon
        type="dingding-o"
        style={{
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);
const desc2 = (
  <div className={styles.stepDescription}>
    <Fragment>
      周毛毛
      <Icon
        type="dingding-o"
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>
      <a href="">催一下</a>
    </div>
  </div>
);
const popoverContent = (
  <div
    style={{
      width: 160,
    }}
  >
    吴加号
    <span
      className={styles.textSecondary}
      style={{
        float: 'right',
      }}
    >
      <Badge
        status="default"
        text={
          <span
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            未响应
          </span>
        }
      />
    </span>
    <div
      className={styles.textSecondary}
      style={{
        marginTop: 4,
      }}
    >
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) => {
  if (status === 'process') {
    return (
      <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
        {dot}
      </Popover>
    );
  }

  return dot;
};
const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: text => {
      if (text === 'agree') {
        return <Badge status="success" text="成功" />;
      }

      return <Badge status="error" text="驳回" />;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

@connect(({ profileAdvanced, loading }) => ({
  profileAdvanced,
  loading: loading.effects['profileAdvanced/fetchAdvanced'],
}))
class Advanced extends Component {
  state = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profileAdvanced/fetchAdvanced',
    });
  }

  onOperationTabChange = key => {
    this.setState({
      operationKey: key,
    });
  };

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  render() {
    const { operationKey, tabActiveKey } = this.state;
    const { profileAdvanced, loading } = this.props;
    const { advancedOperation1, advancedOperation2, advancedOperation3 } = profileAdvanced;
    const extraTitle = <div>
      <Button style={{marginRight:15}}>提交重点项目申请</Button>
      <Button onClick={()=>this.props.history.goBack()}>返回</Button>
    </div>
    
    return (
      <PageHeaderWrapper
        title="XXX实验重点项目申请书"
        extra={extraTitle}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        
      >
        {tabActiveKey==='achievement'?<Achievement/>:<>
        <TabPane key='detail'>
        detail
        </TabPane>
        <TabPane key='rule'>
        rule
        </TabPane>
        
        <div className={styles.main}>
          <GridContent>
            <Card
              title="审核进度"
              style={{
                marginBottom: 24,
              }}
            >
              <RouteContext.Consumer>
                {({ isMobile }) => (
                  <Steps
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    progressDot={customDot}
                    current={1}
                  >
                     <Step title="提交重点申请" description={desc1} />
                    <Step title="指导老师审核" description={desc1} />
                    <Step title="实验室审核" description={desc2} />
                    <Step title="二级单位审核" />
                    <Step title="职能部门审核" />
                  </Steps>
                )}
              </RouteContext.Consumer>
            </Card>
            <Card
              title="项目主要内容"
              style={{
                marginBottom: 24,
              }}
            >
              很长一段的主要内容。。。。。。。。。。。。。。。。。。。。。。。。。。。
              
            </Card>
            <Card
            title='项目成员简介'
            style={{
              marginBottom: 24,
            }}
            extra={<Button type="primary">修改</Button>}
            >
              <Descriptions title='项目组长:XXX'>
                <Descriptions.Item label='简介'>项目组长简介</Descriptions.Item>
              </Descriptions>
              <Descriptions title='其他成员简介'>
                <Descriptions.Item label='简介'>其他成员简介</Descriptions.Item>
              </Descriptions>

            </Card>
            <Card
              title="人员信息"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              
             
              {/* <h4
                style={{
                  marginBottom: 16,
                }}
              >
                信息组
              </h4> */}
              <Card style={{marginBottom:20}} type="inner" title="指导老师" bordered={false}>
                <Descriptions
                  style={{
                    marginBottom: 16,
                  }}
                
                >
                  <Descriptions.Item label="姓名">林东东</Descriptions.Item>
                  <Descriptions.Item label="电话">1234567</Descriptions.Item>
                  <Descriptions.Item label="email">XX@Xx.com</Descriptions.Item>
                  <Descriptions.Item label="所属学院">计算机科学学院</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                  </Descriptions.Item>
                </Descriptions>
                <Divider
                  style={{
                    margin: '16px 0',
                  }}
                />
                <Descriptions
                  style={{
                    marginBottom: 16,
                  }}
                
                >
                  <Descriptions.Item label="姓名">林东东</Descriptions.Item>
                  <Descriptions.Item label="电话">1234567</Descriptions.Item>
                  <Descriptions.Item label="email">XX@Xx.com</Descriptions.Item>
                  <Descriptions.Item label="所属学院">计算机科学学院</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Card type="inner" title="学生/助教" bordered={false}>
                <Descriptions
                  style={{
                    marginBottom: 16,
                  }}
                
                >
                  <Descriptions.Item label="姓名">林东东</Descriptions.Item>
                  <Descriptions.Item label="电话">1234567</Descriptions.Item>
                  <Descriptions.Item label="email">XX@Xx.com</Descriptions.Item>
                  <Descriptions.Item label="所属学院">计算机科学学院</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                  </Descriptions.Item>
                </Descriptions>
                <Divider
                  style={{
                    margin: '16px 0',
                  }}
                />
                <Descriptions
                  style={{
                    marginBottom: 16,
                  }}
                
                >
                  <Descriptions.Item label="姓名">林东东</Descriptions.Item>
                  <Descriptions.Item label="电话">1234567</Descriptions.Item>
                  <Descriptions.Item label="email">XX@Xx.com</Descriptions.Item>
                  <Descriptions.Item label="所属学院">计算机科学学院</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Card>
           
              <Card

              title="实验室审核意见"
              
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              >
              1111111111
              </Card>
              <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="二级单位审核意见"
              >
              222222222222222
              </Card>
              <Card         
              style={{
                marginBottom: 24,
              }}
              bordered={false}  
              title="职能部门审核意见"
              >
              <Empty/>
              </Card>
   
            <Card
              className={styles.tabsCard}
              bordered={false}
              title='操作历史'
            >
              <Table
                pagination={false}
                loading={loading}
                dataSource={advancedOperation1}
                columns={columns}
              />
            </Card>
          </GridContent>
        </div>
        </>
        }
      </PageHeaderWrapper>
    );
  }
}

export default Advanced;
